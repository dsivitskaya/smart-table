import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // Создаем компаратор с правилом поиска по нескольким полям
    const compare = createComparison(
        ['skipEmptyTargetValues'], // Массив имен правил (строки!)
        [                          // Массив кастомных правил
            rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
        ]
    );

    return (data, state, action) => {
        // Применяем поиск к данным
        return data.filter(row => compare(row, state));
    };
}