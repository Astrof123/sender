function formatDate(inputString: string): string {
    // 1. Разделяем входную строку на отдельные даты.
    const dates: string[] = inputString.split(',');

    // 2. Словарь соответствия номеров месяцев и их названий.
    const monthNames: { [key: string]: string } = {
        '01': 'января',
        '02': 'февраля',
        '03': 'марта',
        '04': 'апреля',
        '05': 'мая',
        '06': 'июня',
        '07': 'июля',
        '08': 'августа',
        '09': 'сентября',
        '10': 'октября',
        '11': 'ноября',
        '12': 'декабря',
    };


    // 3. Функция для форматирования одной даты (день-месяц).
    const formatDatePair = (datePair: string): string => {
        const [month, day] = datePair.trim().split('-').map(s => s.trim());

        if (!month || !day) {
            return `Неверный формат даты: ${datePair}`;
        }

        if (!monthNames[month]) {
            return `Неверный номер месяца: ${month}`;
        }

        const dayNumber: number = parseInt(day, 10);
        if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
            return `Неверный номер дня: ${day}`;
        }


        return `${day} ${monthNames[month]}`;
    };

    // 4. Форматируем каждую дату и собираем результаты.
    const formattedDates: string[] = dates.map(formatDatePair);

    // 5. Объединяем отформатированные даты в строку.
    return formattedDates.join(', ');
}