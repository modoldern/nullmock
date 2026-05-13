# 🚀 nullmock

[![English](https://img.shields.io/badge/Language-English-blue.svg)](README.md)
[![Türkçe](https://img.shields.io/badge/Dil-T%C3%BCrk%C3%A7e-red.svg)](README-tr.md)
[![Azərbaycanca](https://img.shields.io/badge/Dil-Az%C3%A8rbaycanca-green.svg)](#)
[![Русский](https://img.shields.io/badge/Язык-Русский-yellow.svg)](README-ru.md)
[![ქართული](https://img.shields.io/badge/ენა-ქართული-orange.svg)](README-ka.md)

İldırım sürətində, sıfır asılılıqlı, fayl sistemi əsaslı və ağıllı məlumat yaratma mühərrikinə sahib mock API serveri.

Nullmock `.json` fayllarınızı oxuyur, `/api/users/[id]` kimi dinamik URL yollarını tutur, sorğu (query) parametrlərini anlayır və daxili lüğətlərdən və ya ağıllı təxmin mühərrikindən istifadə edərək saniyələr içində nəhəng həcmdə saxta məlumat yaradır.

## ✨ Xüsusiyyətlər

- **Sıfır Asılılıq:** Saf Node.js. `express`, `faker` və ya ağır `node_modules` qovluqları yoxdur.
- **Fayl Sistemi Yönləndirməsi:** API yollarınızı qovluqlar müəyyən edir (Məs: `mocks/api/users/[id]/GET.json`).
- **Ağıllı Məlumat Mühərriki:** JSON açarlarından məlumat tiplərini avtomatik təxmin edir (Məs: `created_at` üçün real tarix, `user_email` üçün e-poçt yaradır).
- **Daxili Lüğətlər:** Real regional məlumatlar yaratmaq üçün `{{firstName:az}}` və ya `{{city:az}}` kimi teqlərdən istifadə edin.
- **Çoxalma (Repeat) Əmri:** Şablonunuza sadəcə `"_repeat": 100` əlavə edərək millisaniyələr içində 100 istifadəçi yaradın.
- **Kitabxana Rejimi:** Serveri başlatmadan mühərriki birbaşa Node.js skriptlərinizə import edin.

## 📦 Quraşdırma və Sürətli Başlanğıc

Layihənizin əsas qovluğunda bu əmri işlədərək strukturu yaradın:

```bash
npx nullmock init
```

Bu əmr aşağıdakı strukturu quracaq:
- `mocks/`: API endpoint-ləriniz üçün əsas qovluq.
- `mocks/locales/`: Öz xüsusi `.json` lüğətlərinizi buraya atın.
- `mocks/_examples/`: Dərhal başlamağınız üçün **6 Qızıl API Şablonu** daxildir.

*(Nümunələrin yaradılmasını atlamaq üçün bunu işlədin: `npx nullmock init --no-examples`)*

## 🚦 Serveri Başlatmaq

**Seçim 1: Sürətli Başlanğıc**
```bash
npx nullmock
```

**Seçim 2: NPM Scripts (Tövsiyə olunur)**
Bunu `package.json` faylınıza əlavə edin:
```json
"scripts": {
  "mock": "nullmock"
}
```
Sonra işlədin: `npm run mock`

---

## 📂 6 Qızıl Şablon (`_examples`)

`init` əmrini işlətdiyiniz zaman, Nullmock sizə sənaye standartlarında 6 şablon təqdim edir. Bunları kopyalayıb API qovluqlarınıza yapışdıra bilərsiniz:

1. **`1_basic_list.json`**: Sadə, düz bir massiv (kateqoriyalar, ölkələr üçün faydalıdır).
2. **`2_paginated_list.json`**: Standart səhifələmə (offset pagination) strukturu (current_page, data, total).
3. **`3_infinite_scroll.json`**: Kursor (cursor) əsaslı səhifələmə strukturu (has_more, next_cursor).
4. **`4_single_resource.json`**: Tək bir element üçün ətraflı obyekt (Məs: `/users/60`).
5. **`5_dashboard_overview.json`**: Həm xülasə metriklərini, həm də son fəaliyyət massivlərini ehtiva edən hibrid struktur.
6. **`6_lazy_auto_mock.json`**: Sıfır konfiqurasiyalı şablon. Sadəcə açarları yazın (Məs: `"user_email": ""`), dəyərləri boş buraxın; Nullmock-un ağıllı mühərriki onları təxmin edib doldursun!

---

## 🌍 Daxili Lüğətlər (Locales)

Nullmock, sürətli prototipləşdirmə üçün daxili regional məlumatlarla gəlir. JSON fayllarınızda `{{category:lang}}` sintaksisindən istifadə edin.

**Dəstəklənən Daxili Dillər:**
- `en` (İngiliscə)
- `tr` (Türkcə)
- `az` (Azərbaycanca)
- `ru` (Rusca)
- `ka` (Gürcücə)

**İstifadə Nümunəsi:**
```json
{
  "name": "{{firstName:az}} {{lastName:az}}",
  "location": "{{city:az}}"
}
```

**Xüsusi Lüğətlər (Custom Dictionaries):**
Öz məlumatlarınızdan istifadə etmək istəyirsiniz? Sadəcə `mocks/locales/` qovluğunda `az.json` və ya `my_data.json` yaradın. Nullmock avtomatik olaraq layihənizin lüğətlərinə daxili lüğətlərdən daha yüksək prioritet verəcəkdir.

---

## 🌐 Şəbəkə Simulyasiyası (Gecikmə və Xətalar)

Frontend tətbiqinizin yüklənmə (loading) vəziyyətlərini və xəta idarəetməsini asanlıqla test edin. Şəbəkə gecikməsini və HTTP status kodlarını iki yolla simulyasiya edə bilərsiniz:

**1. URL Parametrləri ilə (Dinamik Test)**
Mock fayllarınızı dəyişdirməyə ehtiyac yoxdur! Sadəcə fetch URL-inizə parametr əlavə edin:
- Yüklənmə ekranını test edin: `/api/users?_delay=2000` (2 saniyə gözləyir)
- İcazəsiz girişi test edin: `/api/users?_status=401`
- İkisini birləşdirin: `/api/users?_delay=1000&_status=500`

**2. JSON Konfiqurasiyası ilə (Daimi)**
`_delay` və `_status` açarlarını birbaşa JSON faylınızın içinə əlavə edin. Nullmock onları tətbiq edəcək və müştəriyə (client) cavab göndərməzdən əvvəl təmizləyəcəkdir:
```json
{
  "_status": 404,
  "_delay": 1500,
  "error": "İstifadəçi tapılmadı"
}
```

---

## 🔢 Ağıllı Rəqəm Aralıqları

Qiymətlər, yaşlar və ya cüzdan balansları üçün müəyyən bir aralıqda təsadüfi rəqəmlərə ehtiyacınız var? String (mətn) dəyərlərinizdə istənilən yerə `{{number:min-max}}` teqini əlavə etməyiniz kifayətdir!

```json
{
  "price": "{{number:10-500}}",
  "age": "{{number:18-65}}"
}
```

---

## 🧠 Nullmock-u Kitabxana Kimi İstifadə Etmək (Import)

Nullmock-u server kimi istifadə etmək məcburiyyətində deyilsiniz. Onun güclü yaratma mühərrikini birbaşa backend skriptlərinizə, testlərinizə və ya seeder-lərinizə import edə bilərsiniz!

```javascript
const { deepScanAndRepeat } = require('nullmock');

const myTemplate = {
  "_repeat": 3,
  "id": "{{id}}",
  "email": "", // Ağıllı təxmin
  "name": "{{firstName:az}}"
};

// Anında məlumat yaradın! (Dinamik parametr kimi { id: 10 } göndəririk)
const fakeData = deepScanAndRepeat(myTemplate, { id: 10 });

console.log(fakeData);
```

## 🤝 Töhfə Vermək
Töhfələriniz hər zaman dəyərlidir! Zəhmət olmasa Pull Request-lərinizi `develop` qoluna (branch) yönləndirin.

## 📄 Lisenziya
MIT © modoldern