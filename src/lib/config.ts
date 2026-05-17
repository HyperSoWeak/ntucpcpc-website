export const SITE = {
  title: 'NTUCPCPC 2026',
  description: '臺灣大學程式解題社程式解題競賽 2026',
  registerUrl: 'https://forms.gle/ELeLKN6oM1kRqpPi6',
  email: 'ntucpc@csie.ntu.edu.tw',
  clubUrl: 'https://ntucpc.org/',
} as const;

export const DATES = {
  registerOpen:  new Date('2026-05-18T00:00:00+08:00'),
  registerClose: new Date('2026-07-12T23:59:59+08:00'),
  preliminary:   new Date('2026-07-26T13:00:00+08:00'),
  final:         new Date('2026-08-02T13:00:00+08:00'),
} as const;
