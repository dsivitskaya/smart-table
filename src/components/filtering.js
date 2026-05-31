// @todo: #4.3 — настроить компаратор

export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map((name) => {
                    const el = document.createElement("option");
                    el.textContent = name;
                    el.value = name;
                    return el;
                })
            );
        });
    };

    const applyFiltering = (query, state, action) => {
        // Обработка очистки поля (если есть кнопка reset)
        if (action?.name === "reset") {
            // Очищаем все поля фильтра
            Object.keys(elements).forEach((key) => {
                if (elements[key]) {
                    elements[key].value = "";
                }
            });
        }

        // Формируем объект фильтра
        const filter = {};
        Object.keys(elements).forEach((key) => {
            if (elements[key]) {
                if (
                    ["INPUT", "SELECT"].includes(elements[key].tagName) &&
                    elements[key].value
                ) {
                    filter[`filter[${elements[key].name}]`] = elements[key].value;
                }
            }
        });

        return Object.keys(filter).length
            ? Object.assign({}, query, filter)
            : query;
    };

    return {
        updateIndexes,
        applyFiltering,
    };
}
