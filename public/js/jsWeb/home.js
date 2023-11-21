function getEventsForMonth(month) {
    switch (month) {
        case 8: // Septiembre
            return [
                '21 al 23 MTY - SLP'
            ];
        case 9: // Octubre
            return [
                '6 - 10 New York',
                '11-13 Sabinas Coah.',
                '13, 14 Cdmx',
                '21 Cdmx',
                '31 Uruapan'
            ];
        case 10: // Noviembre
            return [
                '1-2 Uruapan',
                '4 Almoya',
                '9-10 Muzquis',
                '11-12 Xalapa',
                '15-18 Chetumal',
                '18 Cdmx',
                '24,25 Pachuca',
                '27-29 Los Angeles'
            ];
        default:
            return [];
    }
}