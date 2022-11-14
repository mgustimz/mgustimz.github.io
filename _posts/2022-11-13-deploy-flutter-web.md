

> Guide ini dikhususkan untuk deploy tampilan saja, jika ada external API yang digunakan, maka harus di deploy juga di tempat lain agar bisa tersambung dengan tampilannya.

> Alternatif selain menggunakan Netlify, Vercel. caranya hampir mirip.

## Intro

Dalam beberapa case kalian pasti ingin mendeploy aplikasi flutter ke web untuk diakses oleh orang lain secara cepat (tanpa harus install Aplikasi). Nah, untungnya Netlify sudah menyediakan fitur untuk mendeploy aplikasi flutter web. Dalam tutorial ini, kita akan coba deploy aplikasi flutter web ke Netlify.

## Persiapan



- Pastikan sudah punya akun Github dan mengerti cara kerjanya (Push, Pull, Fork, dll).
- Akun [Netlify](www.netlify.com/)  (jika belum punya, silahkan daftar di [Netlify](www.netlify.com/) atau login dengan Github).
- Pastikan sudah punya aplikasi flutter web yang sudah jalan di local.

## Langkah

- Buka code aplikasi yang mau di deploy kemudian masuk ke bagian `web/index.html`
![image](https://user-images.githubusercontent.com/45744788/201647348-d56d843e-7f33-4e7c-9f3a-27de33a8eccb.png)


- Tambahkan kode ini pada bagian bawah script (sehabis serviceWorkerVersion)
```
<script type="text/javascript">
    window.flutterWebRenderer = "html";
</script>
```
![image](https://user-images.githubusercontent.com/45744788/201647740-29761dcd-0331-47a5-b6f0-7ba3efaea949.png)

- Tambahkan juga `INTERNET PERMISSION` pada `AndroidManifest.xml` dan `Info.plist` (jika ada)

```
<uses-permission android:name="android.permission.INTERNET"/>
```

![image](https://user-images.githubusercontent.com/45744788/201659635-27718925-29c6-4ea9-88e0-d616716ba51b.png)




- Push aplikasi flutter web ke Github. untuk contoh ini saya akan push aplikasi flutter web yang sudah saya buat sebelumnya [[image](![image](https://user-images.githubusercontent.com/45744788/201641608-ebe6fbd8-9df3-40da-8668-ecb7ddaf3ec2.png))]

> Pasti tau lah ya cara push ke Github, kalau belum bisa baca di [sini](https://techobservatory.com/how-to-push-code-from-visual-studio-code-to-github/). 

- Buka Netlify (`Login with Github` / `Sign Up` terlebih dahulu)

- lalu klik tombol `Site` pada Navbar diatas, kemudian `Add new site` dan `Import an existing project` 

![image](https://user-images.githubusercontent.com/45744788/201642267-2024703f-79d3-42b3-9b39-79f7609a143b.png)

- Pilih icon Github untuk menghubungkan repository yang sudah kita push tadi ke Netlify.

![image](https://user-images.githubusercontent.com/45744788/201643631-89750477-abbf-42a8-ad09-ddc34fd2818f.png)

- Disini kita akan diminta untuk mengauthorize Netlify untuk mengakses repository Github kita. Klik tombol `Authorize Netlify` untuk melanjutkan.

- Cari repository yang sudah kita push tadi, kemudian klik repository tersebut.

![image](https://user-images.githubusercontent.com/45744788/201644372-b2dca78e-5864-4802-8633-4b83e581b277.png)

- Pada bagian `Build Command` silahkan masukkan (copas) command ini (Fungsinya untuk mendownload flutter versi stable terbaru sekaligus menginstallnya secara remote)

```
if cd flutter; then git checkout stable && git pull && cd ..; else git clone https://github.com/flutter/flutter.git && cd flutter && git checkout stable && cd ..; fi && flutter/bin/flutter config --enable-web && flutter/bin/flutter build web --release
````

![image](https://user-images.githubusercontent.com/45744788/201645191-c8e1d702-58c5-47c4-acbb-f29718c42387.png)

- Pada bagian `Publish Directory` silahkan masukkan (copas) command ini (Fungsinya untuk menentukan folder yang akan di deploy ke Netlify)


```
build/web
```
![image](https://user-images.githubusercontent.com/45744788/201645762-18153038-6ea0-4e43-81b7-e5fd899785f1.png)

- Kemudian klik tombol `Deploy Site` untuk memulai proses deploy.

![image](https://user-images.githubusercontent.com/45744788/201647939-b1dda70d-981f-4adf-ac36-d7075695cb86.png)

- Jika proses deploy sudah selesai, maka akan muncul link untuk mengakses aplikasi flutter web yang sudah kita deploy.

![image](https://user-images.githubusercontent.com/45744788/201648021-2a152874-1b15-48af-ab81-70b1d3b02782.png)

- (Opsional) Jika ingin mempercantik nama domain, pergi ke `Site Overview` -> `Site Setting` -> Site Details -> `Change site name` -> Masukkan nama domain yang diinginkan -> `Save`

![image](https://user-images.githubusercontent.com/45744788/201648347-53d9d5a8-a00e-44b7-bf53-f63cad6aeb07.png)


Selesai 🎉🎉🎉

Untuk melihat aplikasi yang di deploy pada tutorial ini bisa kunjungi [sini](hhttps://fugi-spesial.netlify.app/)







