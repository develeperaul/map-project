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

function respondJson(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
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

function normalizeText(string $text): string
{
    $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = strip_tags($text);
    $text = preg_replace('/\s+/u', ' ', $text) ?? $text;

    return trim($text);
}

function formatPropertyValue(array $property)
{
    $value = $property['VALUE'];

    if ($value === null || $value === '') {
        return null;
    }

    if (($property['PROPERTY_TYPE'] ?? '') === 'F') {
        $path = CFile::GetPath((int) $value);

        return [
            'id' => (int) $value,
            'url' => $path ? absoluteUrl($path) : null,
        ];
    }

    if (($property['PROPERTY_TYPE'] ?? '') === 'L') {
        return [
            'id' => isset($property['VALUE_ENUM_ID']) ? (int) $property['VALUE_ENUM_ID'] : null,
            'value' => (string) ($property['VALUE_ENUM'] ?? $value),
            'xmlId' => $property['VALUE_XML_ID'] ?? null,
        ];
    }

    return is_array($value) ? $value : (string) $value;
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
        $formattedValue = formatPropertyValue($property);
        $item = [
            'id' => (int) $property['ID'],
            'code' => $code,
            'name' => (string) $property['NAME'],
            'type' => (string) $property['PROPERTY_TYPE'],
            'userType' => $property['USER_TYPE'] ?: null,
            'multiple' => ($property['MULTIPLE'] ?? 'N') === 'Y',
            'value' => $formattedValue,
        ];

        if (($property['MULTIPLE'] ?? 'N') === 'Y') {
            if (!array_key_exists($code, $properties)) {
                $properties[$code] = [
                    'id' => (int) $property['ID'],
                    'code' => $code,
                    'name' => (string) $property['NAME'],
                    'type' => (string) $property['PROPERTY_TYPE'],
                    'userType' => $property['USER_TYPE'] ?: null,
                    'multiple' => true,
                    'value' => [],
                ];
            }

            if ($formattedValue !== null) {
                $properties[$code]['value'][] = $formattedValue;
            }

            continue;
        }

        $properties[$code] = $item;
    }

    return $properties;
}

if (!Loader::includeModule('iblock')) {
    respondJson(['error' => 'iblock module is not available'], 500);
}

$elementId = (int) ($_GET['id'] ?? 0);
if ($elementId <= 0) {
    respondJson(['error' => 'id query parameter is required'], 400);
}

$element = CIBlockElement::GetList(
    [],
    [
        'IBLOCK_ID' => EVENTS_IBLOCK_ID,
        'ID' => $elementId,
    ],
    false,
    false,
    [
        'ID',
        'IBLOCK_ID',
        'IBLOCK_SECTION_ID',
        'NAME',
        'CODE',
        'XML_ID',
        'ACTIVE',
        'ACTIVE_FROM',
        'PREVIEW_TEXT',
        'PREVIEW_TEXT_TYPE',
        'DETAIL_TEXT',
        'DETAIL_TEXT_TYPE',
    ]
)->Fetch();

if (!$element) {
    respondJson(['error' => 'element not found'], 404);
}

$detailText = (string) ($element['DETAIL_TEXT'] ?? '');
$previewText = (string) ($element['PREVIEW_TEXT'] ?? '');
$description = normalizeText($detailText) ?: normalizeText($previewText);

respondJson([
    'id' => (string) $element['ID'],
    'iblockId' => (int) $element['IBLOCK_ID'],
    'sectionId' => isset($element['IBLOCK_SECTION_ID']) ? (int) $element['IBLOCK_SECTION_ID'] : null,
    'name' => (string) $element['NAME'],
    'code' => (string) ($element['CODE'] ?? ''),
    'xmlId' => (string) ($element['XML_ID'] ?? ''),
    'active' => (string) ($element['ACTIVE'] ?? ''),
    'activeFrom' => (string) ($element['ACTIVE_FROM'] ?? ''),
    'previewText' => $previewText,
    'previewTextType' => (string) ($element['PREVIEW_TEXT_TYPE'] ?? ''),
    'detailText' => $detailText,
    'detailTextType' => (string) ($element['DETAIL_TEXT_TYPE'] ?? ''),
    'description' => $description,
    'properties' => collectElementProperties($elementId),
]);
