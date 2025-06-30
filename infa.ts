function formatMonthDay(inputString: string): string {
  // 1. Разбиваем строку на пары "месяц-день".
  const pairs: string[] = inputString.split(',');

  // 2. Функция для форматирования одной пары "месяц-день".
  const formatPair = (pair: string): string => {
    const parts: string[] = pair.trim().split('-');
    if (parts.length !== 2) {
      return `Некорректный формат пары: ${pair}`;
    }

    const month: number = parseInt(parts[0].trim());
    const day: number = parseInt(parts[1].trim());

    if (isNaN(month) || isNaN(day)) {
      return `Некорректные числовые значения в паре: ${pair}`;
    }

    if (month < 1 || month > 12) {
      return `Некорректный номер месяца: ${month}`;
    }

    if (day < 1 || day > 31) {
      return `Некорректный номер дня: ${day}`;
    }

    const daySuffix = getDaySuffix(day);

    return `${day}-ый день ${month}-ого месяца`;
  };

  // Функция для получения суффикса для дней (1-ый, 2-ой, 3-ий, и т.д.)
  function getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) {
      return '-ый';
    }
    switch (day % 10) {
      case 1:
        return '-ый';
      case 2:
        return '-ой';
      case 3:
        return '-ий';
      default:
        return '-ый';
    }
  }


  // 3. Форматируем каждую пару и собираем результаты в массив.
  const formattedPairs: string[] = pairs.map(formatPair);

  // 4. Соединяем отформатированные пары в строку, разделенную запятыми.
  return formattedPairs.join(', ');
}