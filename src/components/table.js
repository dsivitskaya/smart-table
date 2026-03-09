import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
// Добавляем шаблоны ДО таблицы (в обратном порядке для prepend)
if (before && before.length) {
    [...before].reverse().forEach(templateId => {
        // Клонируем шаблон и сохраняем в root для доступа
        root[templateId] = cloneTemplate(templateId);
        // Добавляем ВНАЧАЛО контейнера (prepend)
        root.container.prepend(root[templateId].container);
    });
}

// Добавляем шаблоны ПОСЛЕ таблицы
if (after && after.length) {
    after.forEach(templateId => {
        // Клонируем шаблон и сохраняем в root для доступа
        root[templateId] = cloneTemplate(templateId);
        // Добавляем В КОНЕЦ контейнера (append)
        root.container.append(root[templateId].container);
    });
}
  // @todo: #1.3 —  обработать события и вызвать onAction()
  root.container.addEventListener('change', (e) => onAction());

  // Обработка сброса формы
root.container.addEventListener('reset', (e) => {
    // Используем setTimeout для задержки, чтобы поля успели очиститься
    setTimeout(() => {
        onAction();
    }, 0);
});
root.container.addEventListener('submit', (e) => {
    e.preventDefault();
    onAction(e.submitter);

})



  const render = (data) => {
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
    const nextRows = data.map((item) => {
      // Шаг 2.1: Клонируем шаблон строки для каждого элемента данных
      const row = cloneTemplate(rowTemplate);
      // Шаг 2.2: Перебираем все ключи в объекте данных (id, date, customer, seller, total)
      Object.keys(item).forEach((key) => {
        // Шаг 2.3: Проверяем, есть ли элемент с таким data-name в строке
        if (row.elements[key]) {
          row.elements[key].textContent = item[key];
        }
      });

      // Шаг 2.5: Возвращаем готовый DOM-элемент строки
      return row.container;
    });

    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
