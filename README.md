# Library API

RESTful API для управления библиотекой: книги, авторы, аутентификация пользователей.

## Стек

| | |
|---|---|
| **Backend** | PHP 8.4 + Laravel 13 |
| **База данных** | PostgreSQL (production) / SQLite (development) |
| **Аутентификация** | Laravel Sanctum (Bearer-токены) |
| **Frontend build** | Vite 8 + Tailwind CSS 4 |
| **Деплой** | Heroku |

---

## Быстрый старт

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
npm run dev        # параллельно в другом терминале
```

После запуска API доступен по адресу `http://127.0.0.1:8000/api`.

---

## База данных

### Модели и отношения

```
Author ──< Book
(has many)   (belongs to)
```

| Модель | Таблица | Ключевые поля |
|---|---|---|
| `User` | `users` | id, name, email, password |
| `Author` | `authors` | id, name, bio, born_year |
| `Book` | `books` | id, title, isbn, published_year, description, is_available, author_id |

### Заполнение тестовыми данными

```bash
php artisan db:seed   # 5 авторов + 15 книг
```

---

## API Reference

Base URL: `http://127.0.0.1:8000/api`

Защищённые эндпоинты требуют заголовок:
```
Authorization: Bearer <token>
```

---

### Аутентификация

#### `POST /register`

```json
// Запрос
{
  "name": "Иван Петров",
  "email": "ivan@example.com",
  "password": "secret123",
  "password_confirmation": "secret123"
}

// Ответ 201
{
  "user": { "id": 1, "name": "Иван Петров", "email": "ivan@example.com" },
  "token": "1|abcdef..."
}
```

#### `POST /login`

```json
// Запрос
{ "email": "ivan@example.com", "password": "secret123" }

// Ответ 200
{
  "user": { "id": 1, "name": "Иван Петров", "email": "ivan@example.com" },
  "token": "1|abcdef..."
}
```

#### `POST /logout` 🔒

```json
// Ответ 200
{ "message": "Logged out" }
```

#### `GET /user` 🔒

Возвращает данные текущего аутентифицированного пользователя.

---

### Книги

| Метод | Эндпоинт | Авторизация | Описание |
|---|---|:---:|---|
| `GET` | `/books` | — | Список книг (пагинация, 15/стр.) |
| `GET` | `/books/{id}` | — | Одна книга с автором |
| `POST` | `/books` | 🔒 | Создать книгу |
| `PUT / PATCH` | `/books/{id}` | 🔒 | Обновить книгу |
| `DELETE` | `/books/{id}` | 🔒 | Удалить книгу |

**Фильтрация:**
```
GET /api/books?available=true
```

**Тело запроса (POST/PUT/PATCH):**

| Поле | Тип | Обязательное | Ограничения |
|---|---|:---:|---|
| `title` | string | Да | max:255 |
| `author_id` | integer | Да | существующий автор |
| `isbn` | string | — | max:20 |
| `published_year` | integer | — | 1000–2100 |
| `description` | string | — | — |
| `is_available` | boolean | — | — |

```json
// Пример
{
  "title": "Мастер и Маргарита",
  "author_id": 3,
  "isbn": "978-5-04-116640-6",
  "published_year": 1967,
  "description": "Роман Булгакова",
  "is_available": true
}
```

---

### Авторы (публичные)

| Метод | Эндпоинт | Описание |
|---|---|---|
| `GET` | `/authors` | Список авторов с книгами |
| `GET` | `/authors/{id}` | Один автор с книгами |

---

### Прочее

| Метод | Эндпоинт | Описание |
|---|---|---|
| `GET` | `/library` | Мета-информация о библиотеке |
| `GET` | `/hello` | Проверка работы API |

---

## Коды ошибок

| Код | Причина |
|---|---|
| `401` | Токен отсутствует или недействителен |
| `404` | Ресурс не найден |
| `422` | Ошибка валидации |

---

## Структура проекта

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── BookController.php
│   │   ├── AuthorController.php
│   │   └── LibraryController.php
│   └── Requests/
│       ├── StoreBookRequest.php
│       └── UpdateBookRequest.php
└── Models/
    ├── User.php
    ├── Book.php
    └── Author.php
database/
├── migrations/
├── factories/
└── seeders/
routes/
└── api.php
```

---

## Тесты

```bash
composer test
# или
php artisan test
```

Тесты используют in-memory SQLite (`:memory:`).

---

## Деплой на Heroku

```bash
heroku create
heroku addons:create heroku-postgresql:mini
git push heroku main
heroku run php artisan migrate --seed
```

`Procfile` уже настроен для Apache2 + PHP 8.4.

---

## Переменные окружения (.env)

| Переменная | Dev | Production |
|---|---|---|
| `APP_ENV` | `local` | `production` |
| `APP_DEBUG` | `true` | `false` |
| `DB_CONNECTION` | `sqlite` | `pgsql` |
| `DB_HOST` | — | `127.0.0.1` |
| `DB_PORT` | — | `5432` |

CORS по умолчанию разрешает `localhost:5500` и `127.0.0.1:5500`. Для production обновите `config/cors.php`.
