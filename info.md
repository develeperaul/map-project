Array
(
    [iblock] => Array
        (
            [ID] => 1
            [TIMESTAMP_X] => 16.04.2026 10:34:05
            [IBLOCK_TYPE_ID] => events
            [LID] => s1
            [CODE] => events
            [API_CODE] => events
            [REST_ON] => N
            [NAME] => События
            [ACTIVE] => Y
            [SORT] => 10
            [LIST_PAGE_URL] => 
            [DETAIL_PAGE_URL] => 
            [SECTION_PAGE_URL] => 
            [CANONICAL_PAGE_URL] => 
            [PICTURE] => 
            [DESCRIPTION] => 
            [DESCRIPTION_TYPE] => text
            [RSS_TTL] => 24
            [RSS_ACTIVE] => Y
            [RSS_FILE_ACTIVE] => N
            [RSS_FILE_LIMIT] => 
            [RSS_FILE_DAYS] => 
            [RSS_YANDEX_ACTIVE] => N
            [XML_ID] => 
            [TMP_ID] => 6c582e2e86e573d56d2c12a10c6c4348
            [INDEX_ELEMENT] => Y
            [INDEX_SECTION] => Y
            [WORKFLOW] => N
            [BIZPROC] => N
            [SECTION_CHOOSER] => L
            [LIST_MODE] => 
            [RIGHTS_MODE] => S
            [SECTION_PROPERTY] => N
            [PROPERTY_INDEX] => N
            [VERSION] => 2
            [LAST_CONV_ELEMENT] => 0
            [SOCNET_GROUP_ID] => 
            [EDIT_FILE_BEFORE] => 
            [EDIT_FILE_AFTER] => 
            [SECTIONS_NAME] => Разделы
            [SECTION_NAME] => Раздел
            [ELEMENTS_NAME] => Элементы
            [ELEMENT_NAME] => Элемент
            [FULLTEXT_INDEX] => N
            [EXTERNAL_ID] => 
            [LANG_DIR] => /
            [SERVER_NAME] => 
        )

    [fields] => Array
        (
            [IBLOCK_SECTION] => Array
                (
                    [NAME] => Привязка к разделам
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => Array
                        (
                            [KEEP_IBLOCK_SECTION_ID] => N
                        )

                    [VISIBLE] => Y
                )

            [ACTIVE] => Array
                (
                    [NAME] => Активность
                    [IS_REQUIRED] => Y
                    [DEFAULT_VALUE] => Y
                    [VISIBLE] => Y
                )

            [ACTIVE_FROM] => Array
                (
                    [NAME] => Начало активности
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [ACTIVE_TO] => Array
                (
                    [NAME] => Окончание активности
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [SORT] => Array
                (
                    [NAME] => Сортировка
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 500
                    [VISIBLE] => Y
                )

            [NAME] => Array
                (
                    [NAME] => Название
                    [IS_REQUIRED] => Y
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [PREVIEW_PICTURE] => Array
                (
                    [NAME] => Картинка для анонса
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => Array
                        (
                            [FROM_DETAIL] => N
                            [UPDATE_WITH_DETAIL] => N
                            [DELETE_WITH_DETAIL] => N
                            [SCALE] => N
                            [WIDTH] => 
                            [HEIGHT] => 
                            [IGNORE_ERRORS] => N
                            [METHOD] => resample
                            [COMPRESSION] => 95
                            [USE_WATERMARK_TEXT] => N
                            [WATERMARK_TEXT] => 
                            [WATERMARK_TEXT_FONT] => 
                            [WATERMARK_TEXT_COLOR] => 
                            [WATERMARK_TEXT_SIZE] => 
                            [WATERMARK_TEXT_POSITION] => tl
                            [USE_WATERMARK_FILE] => N
                            [WATERMARK_FILE] => 
                            [WATERMARK_FILE_ALPHA] => 
                            [WATERMARK_FILE_POSITION] => tl
                            [WATERMARK_FILE_ORDER] => 
                        )

                    [VISIBLE] => Y
                )

            [PREVIEW_TEXT_TYPE] => Array
                (
                    [NAME] => Тип описания для анонса
                    [IS_REQUIRED] => Y
                    [DEFAULT_VALUE] => text
                    [VISIBLE] => Y
                )

            [PREVIEW_TEXT] => Array
                (
                    [NAME] => Описание для анонса
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [DETAIL_PICTURE] => Array
                (
                    [NAME] => Детальная картинка
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => Array
                        (
                            [SCALE] => N
                            [WIDTH] => 
                            [HEIGHT] => 
                            [IGNORE_ERRORS] => N
                            [METHOD] => resample
                            [COMPRESSION] => 95
                            [USE_WATERMARK_TEXT] => N
                            [WATERMARK_TEXT] => 
                            [WATERMARK_TEXT_FONT] => 
                            [WATERMARK_TEXT_COLOR] => 
                            [WATERMARK_TEXT_SIZE] => 
                            [WATERMARK_TEXT_POSITION] => tl
                            [USE_WATERMARK_FILE] => N
                            [WATERMARK_FILE] => 
                            [WATERMARK_FILE_ALPHA] => 
                            [WATERMARK_FILE_POSITION] => tl
                            [WATERMARK_FILE_ORDER] => 
                        )

                    [VISIBLE] => Y
                )

            [DETAIL_TEXT_TYPE] => Array
                (
                    [NAME] => Тип детального описания
                    [IS_REQUIRED] => Y
                    [DEFAULT_VALUE] => text
                    [VISIBLE] => Y
                )

            [DETAIL_TEXT] => Array
                (
                    [NAME] => Детальное описание
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [XML_ID] => Array
                (
                    [NAME] => Внешний код
                    [IS_REQUIRED] => Y
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [CODE] => Array
                (
                    [NAME] => Символьный код
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => Array
                        (
                            [UNIQUE] => N
                            [TRANSLITERATION] => N
                            [TRANS_LEN] => 100
                            [TRANS_CASE] => L
                            [TRANS_SPACE] => -
                            [TRANS_OTHER] => -
                            [TRANS_EAT] => Y
                            [USE_GOOGLE] => N
                        )

                    [VISIBLE] => Y
                )

            [TAGS] => Array
                (
                    [NAME] => Теги
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [SECTION_NAME] => Array
                (
                    [NAME] => Название
                    [IS_REQUIRED] => Y
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [SECTION_PICTURE] => Array
                (
                    [NAME] => Картинка для анонса
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => Array
                        (
                            [FROM_DETAIL] => N
                            [UPDATE_WITH_DETAIL] => N
                            [DELETE_WITH_DETAIL] => N
                            [SCALE] => N
                            [WIDTH] => 
                            [HEIGHT] => 
                            [IGNORE_ERRORS] => N
                            [METHOD] => resample
                            [COMPRESSION] => 95
                            [USE_WATERMARK_TEXT] => N
                            [WATERMARK_TEXT] => 
                            [WATERMARK_TEXT_FONT] => 
                            [WATERMARK_TEXT_COLOR] => 
                            [WATERMARK_TEXT_SIZE] => 
                            [WATERMARK_TEXT_POSITION] => tl
                            [USE_WATERMARK_FILE] => N
                            [WATERMARK_FILE] => 
                            [WATERMARK_FILE_ALPHA] => 
                            [WATERMARK_FILE_POSITION] => tl
                            [WATERMARK_FILE_ORDER] => 
                        )

                    [VISIBLE] => Y
                )

            [SECTION_DESCRIPTION_TYPE] => Array
                (
                    [NAME] => Тип описания
                    [IS_REQUIRED] => Y
                    [DEFAULT_VALUE] => text
                    [VISIBLE] => Y
                )

            [SECTION_DESCRIPTION] => Array
                (
                    [NAME] => Описание
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [SECTION_DETAIL_PICTURE] => Array
                (
                    [NAME] => Детальная картинка
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => Array
                        (
                            [SCALE] => N
                            [WIDTH] => 
                            [HEIGHT] => 
                            [IGNORE_ERRORS] => N
                            [METHOD] => resample
                            [COMPRESSION] => 95
                            [USE_WATERMARK_TEXT] => N
                            [WATERMARK_TEXT] => 
                            [WATERMARK_TEXT_FONT] => 
                            [WATERMARK_TEXT_COLOR] => 
                            [WATERMARK_TEXT_SIZE] => 
                            [WATERMARK_TEXT_POSITION] => tl
                            [USE_WATERMARK_FILE] => N
                            [WATERMARK_FILE] => 
                            [WATERMARK_FILE_ALPHA] => 
                            [WATERMARK_FILE_POSITION] => tl
                            [WATERMARK_FILE_ORDER] => 
                        )

                    [VISIBLE] => Y
                )

            [SECTION_XML_ID] => Array
                (
                    [NAME] => Внешний код
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [SECTION_CODE] => Array
                (
                    [NAME] => Символьный код
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => Array
                        (
                            [UNIQUE] => N
                            [TRANSLITERATION] => N
                            [TRANS_LEN] => 100
                            [TRANS_CASE] => L
                            [TRANS_SPACE] => -
                            [TRANS_OTHER] => -
                            [TRANS_EAT] => Y
                            [USE_GOOGLE] => N
                        )

                    [VISIBLE] => Y
                )

            [LOG_SECTION_ADD] => Array
                (
                    [NAME] => LOG_SECTION_ADD
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [LOG_SECTION_EDIT] => Array
                (
                    [NAME] => LOG_SECTION_EDIT
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [LOG_SECTION_DELETE] => Array
                (
                    [NAME] => LOG_SECTION_DELETE
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [LOG_ELEMENT_ADD] => Array
                (
                    [NAME] => LOG_ELEMENT_ADD
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [LOG_ELEMENT_EDIT] => Array
                (
                    [NAME] => LOG_ELEMENT_EDIT
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [LOG_ELEMENT_DELETE] => Array
                (
                    [NAME] => LOG_ELEMENT_DELETE
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => Y
                )

            [XML_IMPORT_START_TIME] => Array
                (
                    [NAME] => XML_IMPORT_START_TIME
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => 
                    [VISIBLE] => N
                )

            [DETAIL_TEXT_TYPE_ALLOW_CHANGE] => Array
                (
                    [NAME] => DETAIL_TEXT_TYPE_ALLOW_CHANGE
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => Y
                    [VISIBLE] => N
                )

            [PREVIEW_TEXT_TYPE_ALLOW_CHANGE] => Array
                (
                    [NAME] => PREVIEW_TEXT_TYPE_ALLOW_CHANGE
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => Y
                    [VISIBLE] => N
                )

            [SECTION_DESCRIPTION_TYPE_ALLOW_CHANGE] => Array
                (
                    [NAME] => SECTION_DESCRIPTION_TYPE_ALLOW_CHANGE
                    [IS_REQUIRED] => N
                    [DEFAULT_VALUE] => Y
                    [VISIBLE] => N
                )

        )

    [messages] => Array
        (
            [ELEMENT_NAME] => Элемент
            [ELEMENTS_NAME] => Элементы
            [ELEMENT_ADD] => Добавить элемент
            [ELEMENT_EDIT] => Изменить элемент
            [ELEMENT_DELETE] => Удалить элемент
            [SECTION_NAME] => Раздел
            [SECTIONS_NAME] => Разделы
            [SECTION_ADD] => Добавить раздел
            [SECTION_EDIT] => Изменить раздел
            [SECTION_DELETE] => Удалить раздел
        )

    [permissions] => Array
        (
            [1] => X
            [2] => R
        )

    [properties] => Array
        (
            [PROP1] => Array
                (
                    [ID] => 1
                    [TIMESTAMP_X] => 2026-04-16 10:34:04
                    [IBLOCK_ID] => 1
                    [NAME] => Геопозиция
                    [ACTIVE] => Y
                    [SORT] => 10
                    [CODE] => PROP1
                    [DEFAULT_VALUE] => 
                    [PROPERTY_TYPE] => S
                    [ROW_COUNT] => 1
                    [COL_COUNT] => 30
                    [LIST_TYPE] => L
                    [MULTIPLE] => N
                    [XML_ID] => 
                    [FILE_TYPE] => 
                    [MULTIPLE_CNT] => 5
                    [TMP_ID] => 
                    [LINK_IBLOCK_ID] => 0
                    [WITH_DESCRIPTION] => N
                    [SEARCHABLE] => N
                    [FILTRABLE] => N
                    [IS_REQUIRED] => Y
                    [VERSION] => 2
                    [USER_TYPE] => map_yandex
                    [USER_TYPE_SETTINGS] => Array
                        (
                        )

                    [HINT] => 
                )

            [PROP2] => Array
                (
                    [ID] => 2
                    [TIMESTAMP_X] => 2026-04-16 10:34:04
                    [IBLOCK_ID] => 1
                    [NAME] => Локация текстом
                    [ACTIVE] => Y
                    [SORT] => 20
                    [CODE] => PROP2
                    [DEFAULT_VALUE] => 
                    [PROPERTY_TYPE] => S
                    [ROW_COUNT] => 1
                    [COL_COUNT] => 30
                    [LIST_TYPE] => L
                    [MULTIPLE] => N
                    [XML_ID] => 
                    [FILE_TYPE] => 
                    [MULTIPLE_CNT] => 5
                    [TMP_ID] => 
                    [LINK_IBLOCK_ID] => 0
                    [WITH_DESCRIPTION] => N
                    [SEARCHABLE] => N
                    [FILTRABLE] => N
                    [IS_REQUIRED] => Y
                    [VERSION] => 2
                    [USER_TYPE] => 
                    [USER_TYPE_SETTINGS] => a:0:{}
                    [HINT] => 
                )

            [PROP3] => Array
                (
                    [ID] => 3
                    [TIMESTAMP_X] => 2026-04-16 10:34:04
                    [IBLOCK_ID] => 1
                    [NAME] => Дата мероприятия
                    [ACTIVE] => Y
                    [SORT] => 30
                    [CODE] => PROP3
                    [DEFAULT_VALUE] => 
                    [PROPERTY_TYPE] => S
                    [ROW_COUNT] => 1
                    [COL_COUNT] => 30
                    [LIST_TYPE] => L
                    [MULTIPLE] => N
                    [XML_ID] => 
                    [FILE_TYPE] => 
                    [MULTIPLE_CNT] => 5
                    [TMP_ID] => 
                    [LINK_IBLOCK_ID] => 0
                    [WITH_DESCRIPTION] => N
                    [SEARCHABLE] => N
                    [FILTRABLE] => N
                    [IS_REQUIRED] => Y
                    [VERSION] => 2
                    [USER_TYPE] => Date
                    [USER_TYPE_SETTINGS] => 
                    [HINT] => 
                )

            [PROP4] => Array
                (
                    [ID] => 4
                    [TIMESTAMP_X] => 2026-04-16 10:34:04
                    [IBLOCK_ID] => 1
                    [NAME] => Вид спорта
                    [ACTIVE] => Y
                    [SORT] => 40
                    [CODE] => PROP4
                    [DEFAULT_VALUE] => 
                    [PROPERTY_TYPE] => L
                    [ROW_COUNT] => 1
                    [COL_COUNT] => 30
                    [LIST_TYPE] => L
                    [MULTIPLE] => N
                    [XML_ID] => 
                    [FILE_TYPE] => 
                    [MULTIPLE_CNT] => 5
                    [TMP_ID] => 
                    [LINK_IBLOCK_ID] => 0
                    [WITH_DESCRIPTION] => N
                    [SEARCHABLE] => N
                    [FILTRABLE] => N
                    [IS_REQUIRED] => N
                    [VERSION] => 2
                    [USER_TYPE] => 
                    [USER_TYPE_SETTINGS] => a:0:{}
                    [HINT] => 
                    [VALUES] => Array
                        (
                            [0] => Array
                                (
                                    [ID] => 1
                                    [PROPERTY_ID] => 4
                                    [VALUE] => Бег
                                    [DEF] => N
                                    [SORT] => 1
                                    [XML_ID] => 1
                                    [TMP_ID] => 
                                    [EXTERNAL_ID] => 1
                                    [PROPERTY_NAME] => Вид спорта
                                    [PROPERTY_CODE] => PROP4
                                    [PROPERTY_SORT] => 40
                                )

                            [1] => Array
                                (
                                    [ID] => 2
                                    [PROPERTY_ID] => 4
                                    [VALUE] => Плавание
                                    [DEF] => N
                                    [SORT] => 2
                                    [XML_ID] => 2
                                    [TMP_ID] => 
                                    [EXTERNAL_ID] => 2
                                    [PROPERTY_NAME] => Вид спорта
                                    [PROPERTY_CODE] => PROP4
                                    [PROPERTY_SORT] => 40
                                )

                        )

                )

            [PROP5] => Array
                (
                    [ID] => 5
                    [TIMESTAMP_X] => 2026-04-16 10:34:04
                    [IBLOCK_ID] => 1
                    [NAME] => Теги
                    [ACTIVE] => Y
                    [SORT] => 50
                    [CODE] => PROP5
                    [DEFAULT_VALUE] => 
                    [PROPERTY_TYPE] => S
                    [ROW_COUNT] => 1
                    [COL_COUNT] => 30
                    [LIST_TYPE] => L
                    [MULTIPLE] => Y
                    [XML_ID] => 
                    [FILE_TYPE] => 
                    [MULTIPLE_CNT] => 5
                    [TMP_ID] => 
                    [LINK_IBLOCK_ID] => 0
                    [WITH_DESCRIPTION] => N
                    [SEARCHABLE] => N
                    [FILTRABLE] => N
                    [IS_REQUIRED] => N
                    [VERSION] => 2
                    [USER_TYPE] => 
                    [USER_TYPE_SETTINGS] => a:0:{}
                    [HINT] => 
                )

            [PROP6] => Array
                (
                    [ID] => 6
                    [TIMESTAMP_X] => 2026-04-16 10:34:04
                    [IBLOCK_ID] => 1
                    [NAME] => Фотогалерея
                    [ACTIVE] => Y
                    [SORT] => 60
                    [CODE] => PROP6
                    [DEFAULT_VALUE] => 
                    [PROPERTY_TYPE] => F
                    [ROW_COUNT] => 1
                    [COL_COUNT] => 30
                    [LIST_TYPE] => L
                    [MULTIPLE] => Y
                    [XML_ID] => 
                    [FILE_TYPE] => jpg, gif, bmp, png, jpeg, webp
                    [MULTIPLE_CNT] => 5
                    [TMP_ID] => 
                    [LINK_IBLOCK_ID] => 0
                    [WITH_DESCRIPTION] => N
                    [SEARCHABLE] => N
                    [FILTRABLE] => N
                    [IS_REQUIRED] => N
                    [VERSION] => 2
                    [USER_TYPE] => 
                    [USER_TYPE_SETTINGS] => a:0:{}
                    [HINT] => 
                )

            [PROP7] => Array
                (
                    [ID] => 7
                    [TIMESTAMP_X] => 2026-04-16 10:34:04
                    [IBLOCK_ID] => 1
                    [NAME] => Статус для проектных
                    [ACTIVE] => Y
                    [SORT] => 70
                    [CODE] => PROP7
                    [DEFAULT_VALUE] => 
                    [PROPERTY_TYPE] => L
                    [ROW_COUNT] => 1
                    [COL_COUNT] => 30
                    [LIST_TYPE] => L
                    [MULTIPLE] => N
                    [XML_ID] => 
                    [FILE_TYPE] => 
                    [MULTIPLE_CNT] => 5
                    [TMP_ID] => 
                    [LINK_IBLOCK_ID] => 0
                    [WITH_DESCRIPTION] => N
                    [SEARCHABLE] => N
                    [FILTRABLE] => N
                    [IS_REQUIRED] => N
                    [VERSION] => 2
                    [USER_TYPE] => 
                    [USER_TYPE_SETTINGS] => a:0:{}
                    [HINT] => 
                    [VALUES] => Array
                        (
                            [0] => Array
                                (
                                    [ID] => 3
                                    [PROPERTY_ID] => 7
                                    [VALUE] => В процессе
                                    [DEF] => N
                                    [SORT] => 1
                                    [XML_ID] => 1
                                    [TMP_ID] => 
                                    [EXTERNAL_ID] => 1
                                    [PROPERTY_NAME] => Статус для проектных
                                    [PROPERTY_CODE] => PROP7
                                    [PROPERTY_SORT] => 70
                                )

                            [1] => Array
                                (
                                    [ID] => 4
                                    [PROPERTY_ID] => 7
                                    [VALUE] => Завершен
                                    [DEF] => N
                                    [SORT] => 2
                                    [XML_ID] => 2
                                    [TMP_ID] => 
                                    [EXTERNAL_ID] => 2
                                    [PROPERTY_NAME] => Статус для проектных
                                    [PROPERTY_CODE] => PROP7
                                    [PROPERTY_SORT] => 70
                                )

                        )

                )

            [PROP8] => Array
                (
                    [ID] => 8
                    [TIMESTAMP_X] => 2026-04-16 10:34:04
                    [IBLOCK_ID] => 1
                    [NAME] => Служебное
                    [ACTIVE] => Y
                    [SORT] => 80
                    [CODE] => PROP8
                    [DEFAULT_VALUE] => 
                    [PROPERTY_TYPE] => S
                    [ROW_COUNT] => 1
                    [COL_COUNT] => 30
                    [LIST_TYPE] => L
                    [MULTIPLE] => N
                    [XML_ID] => 
                    [FILE_TYPE] => 
                    [MULTIPLE_CNT] => 5
                    [TMP_ID] => 
                    [LINK_IBLOCK_ID] => 0
                    [WITH_DESCRIPTION] => N
                    [SEARCHABLE] => N
                    [FILTRABLE] => N
                    [IS_REQUIRED] => N
                    [VERSION] => 2
                    [USER_TYPE] => 
                    [USER_TYPE_SETTINGS] => 
                    [HINT] => 
                )

        )

)