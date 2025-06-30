function numbersToDaysOfWeek(numbersString) {
  // 1. Разбиваем строку на массив чисел.
  const numbersArray = numbersString.split(',').map(Number).map(num => num.toString().trim());

  // 2. Определяем соответствие между числами и днями недели.
  const dayOfWeekMap = {
    '0': 'Понедельник',
    '1': 'Вторник',
    '2': 'Среда',
    '3': 'Четверг',
    '4': 'Пятница',
    '5': 'Суббота',
    '6': 'Воскресенье',
  };

  // 3. Преобразуем числа в дни недели и собираем их в новый массив.
  const daysOfWeekArray = numbersArray.map(number => {
    if (dayOfWeekMap.hasOwnProperty(number)) {
      return dayOfWeekMap[number];
    } else {
      return `Некорректное число (${number})`; // Или другое сообщение об ошибке
    }
  });

  // 4. Соединяем дни недели в строку, разделенную запятыми.
  const daysOfWeekString = daysOfWeekArray.join(', ');

  return daysOfWeekString;
}

// Пример использования:
const inputString = "0, 2, 4, 6";
const outputString = numbersToDaysOfWeek(inputString);
console.log(outputString); // Вывод: Понедельник, Среда, Пятница, Воскресенье

const invalidInput = "0, 2, 7, 4";
const invalidOutput = numbersToDaysOfWeek(invalidInput);
console.log(invalidOutput); // Вывод: Понедельник, Среда, Некорректное число (7), Пятница