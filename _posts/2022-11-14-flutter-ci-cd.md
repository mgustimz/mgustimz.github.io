---
layout: post
title: Otomatisasi workflow Flutter dengan CI/CD menggunakan Github Actions 🚀 (dari Github ke PlayConsole)
slug: flutter-ci-cd
---


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


Untuk CI/CD sampai Github saja selesai disini ya 🎉

## Langkah (Integrasi ke Play Console) (Opsional)

> Jika tidak punya akun Play Console, silahkan buat dulu ya harganya $25

> Guide yang ini mungkin lebih advanced dari yang atas jadi bear in mind ya 😅

> Guide ini hanya untuk Windows, untuk MacOS dan Linux silahkan cari sendiri ya tapi harusnya sih mirip mirip. atau kalau mau berkontribusi kalau tau caranya untuk Linux dan MacOS silahkan PR ke repo ini ya

Untuk caranya agak sedikit mirip untuk yang di github tapi ada beberapa hal yang berbeda jika sudah masuk Play Console.


### Persiapkan Aplikasi

- Buka file `app/build.gradle` pada project Flutter kalian
- Tambahkan line ini di bagian atasnya `android`
```
   def keystoreProperties = new Properties()
   def keystorePropertiesFile = rootProject.file('key.properties')
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
   }

   android {
         ...
   }
```
- Kemudian temukan block code `buildTypes`
```
 buildTypes {
       release {
           // TODO: Add your own signing config for the release build.
           // Signing with the debug keys for now,
           // so `flutter run --release` works.
           signingConfig signingConfigs.debug
       }
   }
```
- Lalu copas semua dengan code ini
```
   signingConfigs {
       release {
           keyAlias keystoreProperties['keyAlias']
           keyPassword keystoreProperties['keyPassword']
           storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
           storePassword keystoreProperties['storePassword']
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
       }
   }
```

- Nanti hasilnya jadi seperti ini
{% gist 6a56500ffc684e8c3c12500f180afdea %}

Kode diatas diambil dari [flutter.dev](https://docs.flutter.dev/deployment/android)


### Signin app dan build appbundle

Disini kita akan membuat 2 file yaitu `keystore.jks` dan `key.properties`, fungsi keystore untuk menandatangani aplikasi kita, sedangkan key.properties untuk menyimpan informasi dari keystore dan mennyambukan dengan app flutter kita.

Kedua file ini tidak akan di push ke Github, karena juga sudah `.gitignore` secara default

> Pada contoh `Langkah (Build & Deploy)` appbundles dan apk tersebut tidak dibekali dengan keystore, nah salah satu persyaratan untuk bisa upload di Play Console adalah appbundle dan apk tersebut harus dibekali dengan keystore. Jadi mari kita buat keystore dulu lalu kita sign appbundle dan apk tersebut.

- Buka terminal, lalu masuk ke folder project Flutter
- Jalankan perintah 

```
keytool -genkey -v -keystore D:/furniture.jks -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```
- lalu tekan enter

> Keystore `furniture.jks` bisa diganti dengan nama apapun yang kalian inginkan begitu juga dengan alias `upload`

> Path `D:/` berarti kita membuat keystore di `root drive D`, jika kalian ingin membuatnya di drive atau folder lainnya silahkan ganti sesuai dengan drive kalian

- Akan muncul beberapa prompt yang gak penting silahkan isi sesuai keinginan kalian, jika ditanya password yang pertama (`keystore`) catat ya, karena nanti kita akan membutuhkannya
- Kemudian ketikkan 'yes' di akhir prompt
![image](https://user-images.githubusercontent.com/45744788/202095905-46a12f38-d5fe-47dd-a710-7a5aa6134500.png)
> Untuk password keystore saya: 123456 (Minimal 6 karakter)

- Lalu ditanyakan untuk password keduanya (`alias`) masukkan password (jangan langsung enter), jangan lupa dicatat juga password yang ini
![image](https://user-images.githubusercontent.com/45744788/202097063-f7cd75fd-83c6-49c1-8760-58e30569d033.png)

> Untuk password alias saya: 654321 (Minimal 6 karakter dan harus berbeda dgn password keystore)

- Kalau sudah berhasil akan seperti ini dan file dapat ditemukan di drive D
![image](https://user-images.githubusercontent.com/45744788/202098015-b64eb952-0baf-4d0c-8424-a7ab5702ec7c.png)
![image](https://user-images.githubusercontent.com/45744788/202098219-4ab97601-319c-4e14-88cf-a5b1837471f5.png)

- Simpan file keystore tersebut di folder yang aman, karena nanti kita akan membutuhkannya untuk upload ke Play Console dan Integrasi dengan Github Action

> Untuk tutorial ini saya simpan di root drive D untuk memudahkan saja

One down one to go. File `keystore` sudah diamankan sekarang tinggal buat file `key.properties`




### Edit file workfiles

Karena file workflow yang sudah dibuat tadi hanya untuk build dan deploy ke Github, maka kita perlu mengedit file workflow tersebut untuk melakukan integrasi ke Play Console.

Tambahkan 2 line ini / uncomment line ini dari file yang sebelumnya sudah dibuat
```
- name: Decode android/neumodore_key.jks
  run: echo "${{ secrets.KEYSTORE_JKS_PROD }}" | base64 --decode > android/app/keystore.jks
```

```
- name: Decode android/key.properties
  run: echo "${{ secrets.KEY_PROPERTIES_PROD }}" | base64 --decode > android/key.properties
```

> Fungsi diatas digunakan untuk mendecode file `keystore.jks` dan `key.properties` yang sudah di encode sebelumnya. Nah karena kode keystore.js dan key.properties itu sangat sensitif saya sarankan jangan dimasukkan ke version control (Github) karena bisa diakses oleh siapa saja. Jadi saya encode dulu file tersebut lalu masukkan ke Github Secrets dengan metode file ke base64 (karena github secret hanya menerima text).