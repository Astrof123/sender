function numbersToDaysOfWeek(numbersString: string): string {
  // 1. Разбиваем строку на массив чисел и удаляем пробелы.
  const numbersArray: string[] = numbersString.split(',').map(num => num.trim());

  // 2. Определяем соответствие между числами и днями недели.
  const dayOfWeekMap: { [key: string]: string } = {
    '0': 'Понедельник',
    '1': 'Вторник',
    '2': 'Среда',
    '3': 'Четверг',
    '4': 'Пятница',
    '5': 'Суббота',
    '6': 'Воскресенье',
  };

  // 3. Преобразуем числа в дни недели и собираем их в новый массив.
  const daysOfWeekArray: string[] = numbersArray.map(number => {
    if (dayOfWeekMap.hasOwnProperty(number)) {
      return dayOfWeekMap[number];
    } else {
      return `Некорректное число (${number})`; // Или другое сообщение об ошибке
    }
  });

  // 4. Соединяем дни недели в строку, разделенную запятыми.
  const daysOfWeekString: string = daysOfWeekArray.join(', ');

  return daysOfWeekString;
}

// Пример использования:
const inputString: string = "0, 2, 4, 6";
const outputString: string = numbersToDaysOfWeek(inputString);
console.log(outputString); // Вывод: Понедельник, Среда, Пятница, Воскресенье

const invalidInput: string = "0, 2, 7, 4";
const invalidOutput: string = numbersToDaysOfWeek(invalidInput);
console.log(invalidOutput); // Вывод: Понедельник, Среда, Некорректное число (7), Пятница
