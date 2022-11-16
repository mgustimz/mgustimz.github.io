---
layout: post
title: Otomatisasi workflow Flutter dengan CI/CD menggunakan Github Actions 🚀 (dari Github ke PlayConsole)
slug: flutter-ci-cd
toc: true
---


## Intro

CI/CD digunakan untuk mempermudah developer dalam melakukan proses build, test, dan deploy aplikasi. Dengan CI/CD, developer tidak perlu melakukan build, test, dan deploy secara manual. CI/CD akan melakukan build, test, dan deploy secara otomatis. Dengan CI/CD, developer dapat fokus pada proses development aplikasi, sehingga developer dapat menghemat waktu dan meningkatkan produktivitas.

Dalam guide ini akan dibahas bagaimana cara melakukan CI/CD pada aplikasi Flutter menggunakan Github Actions. 

> Untuk unit test tidak dibahas ya disini hanya fokus ke build dan deploy saja 🤣

## Persiapan
- Punya akun Github dan mengerti dasar-dasarnya (Push, Pull, Fork, PR, dll)
- Project Flutter yang sudah jalan di lokal (Aktifkan `INTERNET PERMISSION` di `AndroidManifest.xml`)
- (Opsional) Akun Play Console untuk melakukan deploy secara otomatis ke Play Store

## Langkah (Build & Deploy Only)

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

## Langkah (Build, Deploy, dan Integrasi Play Console) (Opsional)

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

#### Membuat keystore.jks

> Pada contoh `Langkah (Build & Deploy Only)` appbundles dan apk tersebut tidak dibekali dengan keystore, nah salah satu persyaratan untuk bisa upload di Play Console adalah appbundle dan apk tersebut harus dibekali dengan keystore. Jadi mari kita buat keystore dulu lalu kita sign appbundle dan apk tersebut.

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

One down one to go. File `keystore.jks` sudah diamankan sekarang tinggal buat file `key.properties`

#### Membuat key.properties

- Pergi ke root folder aplikasi flutter kalian lalu buka folder `android`
- Buat file dengan nama `key.properties`
![image](https://user-images.githubusercontent.com/45744788/202100989-a14e49c0-a8aa-4e38-99c9-2e30cdb31b74.png)

- Buka file tersebut dengan text editor, lalu isi dengan string ini
```
storePassword=123456 
keyPassword=654321
keyAlias=upload
storeFile=D:/furniture.jks
```

> `storePassword` dan `keyPassword` adalah password yang kalian catat tadi, `storePassword` adalah password keystore dan `keyPassword` adalah password alias

> `keyAlias` merupakan alias yang kita set tadi

> `storeFile` adalah path `keystore.jks` yang kita buat tadi karena tadi saya buat di root drive D maka saya arahkan kesana

![image](https://user-images.githubusercontent.com/45744788/202102501-a09ef511-a7fb-4168-9af8-c7ce775fd0a1.png)

#### Sign appbundle

file `keystore.jks` dan `key.properties` sudah siap, sekarang kita akan sign appbundle dan apk

Jika semua sudah selesai, kita bisa sign appbundle dan apk kita dengan menjalankan perintah ini

```
flutter build appbundle
```

Tunggu beberapa saat, jika sudah selesai maka akan muncul file `app-release.aab` di folder `build/app/outputs/bundle/release`

Ini adalah app yang sudah di sign dengan keystore yang kita buat tadi

![image](https://user-images.githubusercontent.com/45744788/202103957-2d60d7a7-9c15-4345-af65-efa43aa2a081.png)


### To the PlayConsole, we go !

> Pastikan sudah buat akun Play Console dulu ya

> Tujuan section ini adalah untuk mendapatkan appid yang akan kita gunakan untuk integrasi dengan Github Action, serta Mensetup keystore yang kita generate tadi dengan PlayConsole.

> Disini saya menggunakan mode `Internal testing` jika ingin menggunakan mode perilisan lainnya silahkan disesuaikan

Flow nya kira kira seperti ini
- [x]  Upload Manual 1x untuk mendapatkan app id 
- [x]  Setup keystore yang kita buat tadi agar SHA nya sama ketika di deploy lewat Github Action
- [x] Setelah itu bisa deploy lewat Github Action sepuasnya


Login ke PlayConsole lalu buat aplikasi baru

- Isikan nama aplikasi, dll lalu `Create`
- Pilih `Internal testing` pada sidebar `Play Console`
- Lalu `Create a new release`

![image](https://user-images.githubusercontent.com/45744788/202113275-062d5ef4-3e06-48b0-a9eb-7af7f7fa7f36.png)

- Ganti metode app signin menggunakan keystore yang sudah kita buat tadi agar tidak ter generate otomatis oleh Google
![image](https://user-images.githubusercontent.com/45744788/202113780-cb85d159-0758-4df1-a8b7-991fa6597d25.png)

- Pilih `Use a different key`
![image](https://user-images.githubusercontent.com/45744788/202114282-5f9651cd-b1e8-46ff-8efa-4ac29da7f982.png)

- Lalu pilih yang `Export and upload from Java keystore`
![image](https://user-images.githubusercontent.com/45744788/202114710-e6cf83f0-be25-47f9-9ad7-8bed2a9ca522.png)

- Download `PEPK` tool nya, lalu letakkan di tempat dimana `keystore` tadi disimpan
![image](https://user-images.githubusercontent.com/45744788/202117397-f0ef0de8-bcc2-4ba4-a2e7-b447fdd1266c.png)

- Buka terminal lalu ketikkan perintah ini

```
$ java -jar pepk.jar --keystore=furniture.jks --alias=upload --output=output.zip --include-cert --encryptionkey=eb10fe8f7c7c9df715022017b00c6471f8ba8170b13049a11e6c09ffe3056a104a3bbe4ac5a955f4ba4fe93fc8cef27558a3eb9d2a529a2092761fb833b656cd48b9de6a
```

![image](https://user-images.githubusercontent.com/45744788/202118058-7fd18e8b-c3c4-4b88-adeb-cb29d3903b11.png)

> `keystore` dengan value `furniture,jks` adalah nama key yang kita buat tadi, begitu juga dengan `alias` yang tadi kita namai `upload`

- Pencet enter kemudian akan ditanyai 2 password tadi, masukkan keduanya dengan benar

- Jika sukses maka akan ada file `output.zip`
![image](https://user-images.githubusercontent.com/45744788/202118718-88ece3b1-342f-452a-a30e-547940910d3c.png)

- Upload file ini ke dalam kolom upload untuk menset key nya
![image](https://user-images.githubusercontent.com/45744788/202119055-829bc36f-086a-4f92-bf21-ead85f2f41d1.png)

- Maka prompt akan berubah menjadi seperti ini
![image](https://user-images.githubusercontent.com/45744788/202119180-26021626-e8b9-4f14-8c1d-261d3da14406.png)

- Langkah terakhir upload aab yang digenerate dengan key ini untuk mendapatkan app id
![image](https://user-images.githubusercontent.com/45744788/202119672-3eb45ce1-8e93-4734-a0da-834e67634920.png) 
![image](https://user-images.githubusercontent.com/45744788/202125875-ce868cfa-0f54-4e0d-95ef-443b60ffc011.png)
![image](https://user-images.githubusercontent.com/45744788/202126942-71d7a86a-1eda-450c-8fa7-4bb1635e6fe0.png)

> App ID yang didapat adalah com.nighthawk.heh

Dengan ini sudah siap untuk pindah ke Github Action


### Working dengan Github Action

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

> Fungsi diatas digunakan untuk mendecode file `keystore.jks` dan `key.properties` yang akan kita encode pada section selanjutnya. Nah karena kode keystore.js dan key.properties itu sangat sensitif saya sarankan jangan dimasukkan ke version control (Github) karena bisa diakses oleh siapa saja. Jadi saya encode dulu file tersebut lalu masukkan ke Github Secrets dengan metode file ke base64 (karena github secret hanya menerima text).

Hasil jadinya akan seperti ini (copas aja, sudah self explanatory dan sudah kukasih komen)

<details>
	<summary>Click to expand</summary>
	
{% gist fde01d848eb4c8f0a950017f02295614 %}
</details>


### Sshh, its our Secret

Notice pada gist diatas ada value seperti `KEYSTORE_JKS_PROD` dan `KEY_PROPERTIES_PROD`, dan `GOOGLE_SERVICE_JSONKEY` itu adalah nama yang kita buat di Github Secrets. Jadi kita perlu membuat 3 secrets dengan nama tersebut.

> Kenapa gak langsung di push saja ke Github ? dont please dont. Karena file `keystore.jks`, `key.properties`, dan `services.json` itu sangat sensitif, jadi jangan sampai ada orang yang bisa mengakses file tersebut. Jadi kita encode dulu file tersebut lalu masukkan ke Github Secrets dengan metode file ke base64 (karena github secret hanya menerima text).

#### Encode KEYSTORE_JKS_PROD ke base64

- Buka website https://base64.guru/converter/encode/file
- Buka file lokasi file `keystore.jks` (disini saya pakai `furniture.jks`) yang sudah kita buat tadi
- Upload file ke dalam kolom upload
- Lalu klik tombol `Encode file to base64`
![image](https://user-images.githubusercontent.com/45744788/202133848-2e49c036-4812-4baa-9b33-baa684b0c5f8.png)
- Copy hasilnya (Letakkan di Notepad atau tempat catatan lain untuk sementara)

#### Encode KEY_PROPERTIES_PROD ke base64
- Sebelum di encode buka file `key.properties` dan ubah value `storeFile` menjadi `keystore.jks`. Karena hasil decode nama filenya nanti akan diubah secara otomatis menjadi `keystore.jks` dan tidak `furniture.jks`
![image](https://user-images.githubusercontent.com/45744788/202174165-56aaada4-d4bd-4f64-8ba2-e5a44f025d46.png)
- Buka website https://base64.guru/converter/encode/file
- Buka file lokasi file `key.properties` yang sudah kita buat tadi
- Upload file ke dalam kolom upload
- Lalu klik tombol `Encode file to base64`
![image](https://user-images.githubusercontent.com/45744788/202174801-1ed77e3f-541c-4583-8598-da0877f9d392.png)
- Copy hasilnya (Letakkan di Notepad atau tempat catatan lain untuk sementara)


#### Mendapatkan Google Service Json Key

Bisa dibaca lebih lanjut disini

- https://www.iwantanelephant.com/blog/2020/11/17/how-to-configure-api-access-to-google-play-console/
- https://developers.google.com/android-publisher/getting_started

- Nanti outputnya akan berbentuk json seperti ini
```
{
  "type": "service_account",
  "project_id": "xxx",
  "private_key_id": "xxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\xxx\n-----END PRIVATE KEY-----\n",
  "client_email": "xxx",
  "client_id": "xxx",
  "auth_uri": "xxx",
  "token_uri": "xxx",
  "auth_provider_x509_cert_url": "xxx",
  "client_x509_cert_url": "xxx"
}
```
- Copy hasilnya (Letakkan di Notepad atau tempat catatan lain untuk sementara)