# Google Apps Script bridge

`Code.gs` menyediakan fungsi penyimpanan order ke Google Sheets melalui
`google.script.run.saveOrder(order)`.

Untuk deployment final, hasil build frontend perlu dimasukkan sebagai file
`index.html` di project Apps Script. Saat aplikasi dibuka di preview Vite,
frontend otomatis memakai `localStorage`; saat dibuka dari Apps Script, data
juga diteruskan ke sheet `Orders`.

## Alur printing

Pencetakan mengikuti pola aplikasi Google Spreadsheet:

1. Frontend membuat versi struk yang hanya terlihat saat proses print.
2. Frontend memanggil API browser `window.print()`.
3. Browser meneruskan job ke dialog cetak native Windows.
4. Pemilihan printer, jumlah salinan, ukuran kertas, dan konfigurasi lainnya
   ditangani oleh browser serta Windows, bukan oleh Google Apps Script.

Dengan alur ini web app tidak membutuhkan akses langsung ke driver printer.
Browser memang tidak mengizinkan aplikasi web memilih printer atau mencetak
diam-diam. Print tanpa dialog hanya dimungkinkan dengan konfigurasi kiosk
printing atau local print bridge terpisah.
