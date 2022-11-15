---
layout: post
title: Otomatisasi workflow Flutter dengan CI/CD menggunakan Github Actions 🚀 (dari Github ke PlayConsole)
slug: flutter-ci-cd
---

> Alternatif selain Github Actions adalah menggunakan Gitlab CI/CD. Namun, Codemagic juga menyediakan layanan CI/CD gratis untuk Flutter. Namun, saya lebih suka menggunakan Github Actions karena lebih mudah dan lebih fleksibel dan juga sudah bawaan github jadi tidak perlu ke website lain 🤣🤣.

## Intro

CI/CD digunakan untuk mempermudah developer dalam melakukan proses build, test, dan deploy aplikasi. Dengan CI/CD, developer tidak perlu melakukan build, test, dan deploy secara manual. CI/CD akan melakukan build, test, dan deploy secara otomatis. Dengan CI/CD, developer dapat fokus pada proses development aplikasi, sehingga developer dapat menghemat waktu dan meningkatkan produktivitas.

Dalam guide ini akan dibahas bagaimana cara melakukan CI/CD pada aplikasi Flutter menggunakan Github Actions. 

> Untuk unit test tidak dibahas ya disini hanya fokus ke build dan deploy saja 🤣

## Persiapan
- Punya akun Github dan mengerti dasar-dasarnya (Push, Pull, Fork, PR, dll)
- Project Flutter yang sudah jalan di lokal (Aktifkan `INTERNET PERMISSION` di `AndroidManifest.xml`)
- (Opsional) Akun Play Console untuk melakukan deploy secara otomatis ke Play Store

## Langkah (Build & Deploy)



### Buat file workflow

File workflow ini akan berisi konfigurasi untuk melakukan build dan deploy aplikasi Flutter. File workflow ini akan berada di folder `.github/workflows` dengan nama `flutter.yml`. 

- Buat file workflow dengan nama `flutter.yml` di folder `.github/workflows` ( kalau belum ada folder `.github/workflows` silahkan buat dulu )
![image](https://user-images.githubusercontent.com/45744788/202035956-5adda872-9c41-4559-91c0-6941625264eb.png)

- Isi file workflow dengan konfigurasi berikut
{% gist 9947b4050fe011582d749855cbd97fc6 %}

- Kemudian commit dan push ke Github
![image](https://user-images.githubusercontent.com/45744788/202039290-44b8e22a-baec-44d9-ae6c-e58fbf70f302.png)

- Jika sudah cek tab `Actions` di Github, maka akan muncul workflow yang sudah dibuat tadi, tetapi belum berjalan.
![image](https://user-images.githubusercontent.com/45744788/202039396-affe7c3f-e87b-44cc-873c-bd423744c16b.png)


### Menjalankan workflow

untuk menjalankan workflow, kita bisa melakukan push tag ke Github sesuai dengan konfigurasi yang sudah dibuat tadi.

Karena kita sudah membuat konfigurasi untuk melakukan build dan deploy ketika ada tag baru, maka kita bisa melakukan push tag ke Github.

- Buka terminal, lalu masuk ke folder project Flutter
- (Opsional) Jika ada file yang berubah lakukan commit terlebih dahulu
- Jalankan perintah `git tag v1.0.0` untuk membuat tag baru dengan nama `v1.0.0` lalu tekan enter
- Jalankan perintah `git push origin v1.0.0` untuk push tag ke Github lalu tekan enter
![image](https://user-images.githubusercontent.com/45744788/202040182-ed9303ea-97d1-4e1b-84d5-132a8323f627.png)
- Cek tab `Actions` di Github, maka workflow akan berjalan
![image](https://user-images.githubusercontent.com/45744788/202040291-4c48f976-b2ad-439c-ab32-fbd2542ccffc.png)
- Tunggu sampai workflow selesai berjalan (Kurang lebih 5-7 menit)
![image](https://user-images.githubusercontent.com/45744788/202040433-4e1afdf8-10c9-49ee-9f6e-55062c1f3a4d.png)
- Jika sudah selesai, cek tab `Releases` di Github, maka akan muncul release yang sudah dibuat tadi
![image](https://user-images.githubusercontent.com/45744788/202040879-47158fe3-3191-43ff-8b25-ec5da9b5520b.png)


## Langkah (Integrasi ke Play Console) (Opsional)

Soon 🎉