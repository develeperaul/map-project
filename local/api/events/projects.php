<?php

declare(strict_types=1);

use Bitrix\Main\Loader;

define('NO_KEEP_STATISTIC', true);
define('NO_AGENT_STATISTIC', true);
define('NOT_CHECK_PERMISSIONS', true);
define('STOP_STATISTICS', true);

ini_set('serialize_precision', '-1');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Accept, Content-Type');
header('Access-Control-Max-Age: 86400');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php');

header('Content-Type: application/json; charset=utf-8');

const EVENTS_IBLOCK_ID = 1;
const PROJECTS_SECTION_CODE = 'projects';
const PROJECTS_SECTION_NAME = 'Проекты';

function respondJson(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function findProjectsSectionId(): ?int
{
    $byCode = CIBlockSection::GetList(
        ['SORT' => 'ASC', 'ID' => 'ASC'],
        [
            'IBLOCK_ID' => EVENTS_IBLOCK_ID,
            'ACTIVE' => 'Y',
            '=CODE' => PROJECTS_SECTION_CODE,
        ],
        false,
        ['ID']
    )->Fetch();

    if ($byCode && isset($byCode['ID'])) {
        return (int) $byCode['ID'];
    }

    $byName = CIBlockSection::GetList(
        ['SORT' => 'ASC', 'ID' => 'ASC'],
        [
            'IBLOCK_ID' => EVENTS_IBLOCK_ID,
            'ACTIVE' => 'Y',
            '=NAME' => PROJECTS_SECTION_NAME,
        ],
        false,
        ['ID']
    )->Fetch();

    return $byName && isset($byName['ID']) ? (int) $byName['ID'] : null;
}

function normalizeDateValue($value): string
{
    if (!$value) {
        return '';
    }

    $timestamp = MakeTimeStamp((string) $value);

    return $timestamp ? date('Y-m-d', $timestamp) : '';
}

function getTextValue(array $element): string
{
    $preview = trim((string) ($element['PREVIEW_TEXT'] ?? ''));
    if ($preview !== '') {
        return $preview;
    }

    return trim((string) ($element['DETAIL_TEXT'] ?? ''));
}

function normalizeCoordinates($value): ?array
{
    if (is_array($value)) {
        $lat = $value['lat'] ?? $value['LAT'] ?? $value['latitude'] ?? $value['LATITUDE'] ?? null;
        $lng = $value['lng'] ?? $value['LNG'] ?? $value['lon'] ?? $value['LON'] ?? $value['longitude'] ?? $value['LONGITUDE'] ?? null;

        if (is_numeric($lat) && is_numeric($lng)) {
            return [(float) $lng, (float) $lat];
        }

        $value = implode(',', $value);
    }

    if (!is_string($value) || trim($value) === '') {
        return null;
    }

    preg_match_all('/-?\d+(?:[.,]\d+)?/', $value, $matches);
    if (count($matches[0]) < 2) {
        return null;
    }

    $first = (float) str_replace(',', '.', $matches[0][0]);
    $second = (float) str_replace(',', '.', $matches[0][1]);

    if (abs($first) > 90 && abs($second) <= 90) {
        return [$first, $second];
    }

    return [$second, $first];
}

function collectElementProperties(int $elementId): array
{
    $properties = [];
    $propertyValues = CIBlockElement::GetProperty(
        EVENTS_IBLOCK_ID,
        $elementId,
        ['sort' => 'asc', 'id' => 'asc'],
        []
    );

    while ($property = $propertyValues->Fetch()) {
        $code = (string) ($property['CODE'] ?: $property['ID']);
        $value = $property['VALUE'];

        if (($property['MULTIPLE'] ?? 'N') === 'Y') {
            if (!array_key_exists($code, $properties)) {
                $properties[$code] = [];
            }

            if ($value !== null && $value !== '') {
                $properties[$code][] = $property;
            }

            continue;
        }

        $properties[$code] = $property;
    }

    return $properties;
}

function isListArray(array $value): bool
{
    if ($value === []) {
        return true;
    }

    return array_keys($value) === range(0, count($value) - 1);
}

function absoluteUrl(string $path): string
{
    if (preg_match('/^https?:\/\//i', $path)) {
        return $path;
    }

    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'rad.yes-project.ru';

    return $scheme . '://' . $host . '/' . ltrim($path, '/');
}

function normalizeTags($property): array
{
    $values = is_array($property) && isListArray($property) ? $property : [$property];
    $tags = [];

    foreach ($values as $index => $item) {
        $rawValue = is_array($item) ? ($item['VALUE'] ?? '') : $item;
        $title = trim((string) $rawValue);

        if ($title === '') {
            continue;
        }

        $tags[] = [
            'id' => is_array($item) && isset($item['PROPERTY_VALUE_ID']) ? (int) $item['PROPERTY_VALUE_ID'] : $index + 1,
            'title' => $title,
        ];
    }

    return $tags;
}

function normalizeImages($property): array
{
    $values = is_array($property) && isListArray($property) ? $property : [$property];
    $images = [];

    foreach ($values as $item) {
        $fileId = is_array($item) ? ($item['VALUE'] ?? null) : $item;

        if (!$fileId) {
            continue;
        }

        $path = CFile::GetPath((int) $fileId);
        if ($path) {
            $images[] = ['url' => absoluteUrl($path)];
        }
    }

    return $images;
}

function normalizeSectionImages(array $section): array
{
    $images = [];

    foreach (['PICTURE', 'DETAIL_PICTURE'] as $field) {
        if (empty($section[$field])) {
            continue;
        }

        $path = CFile::GetPath((int) $section[$field]);
        if ($path) {
            $images[] = ['url' => absoluteUrl($path)];
        }
    }

    return $images;
}

function normalizeProjectStatus($property)
{
    if (!is_array($property)) {
        return 50;
    }

    $status = (string) ($property['VALUE_ENUM'] ?? $property['VALUE'] ?? '');
    if (strpos($status, 'Заверш') !== false || strpos($status, 'заверш') !== false) {
        return 'completed';
    }

    return 50;
}

function mapElementToProjectTask(array $element): array
{
    $properties = collectElementProperties((int) $element['ID']);
    $coordinates = normalizeCoordinates($properties['PROP1']['VALUE'] ?? null);
    $tags = normalizeTags($properties['PROP5'] ?? []);

    $marker = [
        'id' => (string) $element['ID'],
        'title' => (string) $element['NAME'],
        'description' => getTextValue($element),
        'category' => 'projects',
        'date' => normalizeDateValue($properties['PROP3']['VALUE'] ?? $element['ACTIVE_FROM'] ?? null),
        'city' => (string) ($properties['PROP2']['VALUE'] ?? ''),
        'status' => normalizeProjectStatus($properties['PROP7'] ?? null),
        'images' => normalizeImages($properties['PROP6'] ?? []),
    ];

    if ($coordinates !== null) {
        $marker['coordinates'] = $coordinates;
    }

    if ($tags !== []) {
        $marker['tags'] = $tags;
    }

    return $marker;
}

function loadProjectTasks(int $sectionId): array
{
    $tasks = [];
    $elements = CIBlockElement::GetList(
        ['ACTIVE_FROM' => 'ASC', 'SORT' => 'ASC', 'ID' => 'ASC'],
        [
            'IBLOCK_ID' => EVENTS_IBLOCK_ID,
            'SECTION_ID' => $sectionId,
            'INCLUDE_SUBSECTIONS' => 'N',
            'ACTIVE' => 'Y',
        ],
        false,
        false,
        ['ID', 'NAME', 'PREVIEW_TEXT', 'DETAIL_TEXT', 'ACTIVE_FROM']
    );

    while ($element = $elements->Fetch()) {
        $tasks[] = mapElementToProjectTask($element);
    }

    return $tasks;
}

function firstNonEmptyValue(array $tasks, string $key)
{
    foreach ($tasks as $task) {
        if (!empty($task[$key])) {
            return $task[$key];
        }
    }

    return null;
}

function getEarliestTaskDate(array $tasks): string
{
    $dates = [];
    foreach ($tasks as $task) {
        $date = (string) ($task['date'] ?? '');
        if ($date !== '') {
            $dates[] = $date;
        }
    }

    sort($dates);

    return $dates[0] ?? '';
}

function getProjectStatus(array $tasks)
{
    if ($tasks === []) {
        return 50;
    }

    foreach ($tasks as $task) {
        if (($task['status'] ?? null) !== 'completed') {
            return 50;
        }
    }

    return 'completed';
}

function mapSectionToProjectMarker(array $section): array
{
    $tasks = loadProjectTasks((int) $section['ID']);
    $sectionImages = normalizeSectionImages($section);
    $taskImages = firstNonEmptyValue($tasks, 'images') ?? [];
    $tags = firstNonEmptyValue($tasks, 'tags') ?? [];
    $date = normalizeDateValue($section['UF_START'] ?? null) ?: getEarliestTaskDate($tasks);

    $marker = [
        'id' => 'section-' . (string) $section['ID'],
        'title' => (string) $section['NAME'],
        'description' => trim((string) ($section['DESCRIPTION'] ?? '')),
        'category' => 'projects',
        'date' => $date,
        'city' => (string) (firstNonEmptyValue($tasks, 'city') ?? ''),
        'status' => getProjectStatus($tasks),
        'images' => $sectionImages !== [] ? $sectionImages : $taskImages,
        'tasks' => $tasks,
    ];

    if ($tags !== []) {
        $marker['tags'] = $tags;
    }

    return $marker;
}

if (!Loader::includeModule('iblock')) {
    respondJson(['error' => 'iblock module is not available'], 500);
}

$sectionId = findProjectsSectionId();
if ($sectionId === null) {
    respondJson(['error' => 'projects section not found'], 404);
}

$items = [];
$sections = CIBlockSection::GetList(
    ['SORT' => 'ASC', 'ID' => 'ASC'],
    [
        'IBLOCK_ID' => EVENTS_IBLOCK_ID,
        'SECTION_ID' => $sectionId,
        'ACTIVE' => 'Y',
    ],
    false,
    ['ID', 'NAME', 'DESCRIPTION', 'PICTURE', 'DETAIL_PICTURE', 'UF_START']
);

while ($section = $sections->Fetch()) {
    $items[] = mapSectionToProjectMarker($section);
}

respondJson($items);
