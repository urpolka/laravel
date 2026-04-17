<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>
# Документация API «Библиотека»

## Базовый URL
http://127.0.0.1:8000/api

Все эндпоинты, кроме register, login, hello, library, требуют аутентификации (Bearer token).

## Аутентификация

### Регистрация
POST /register
{
  "name": "Иван Петров",
  "email": "ivan@example.com",
  "password": "secret123",
  "password_confirmation": "secret123"
}
Ответ (201):
{
  "user": { "id": 1, "name": "Иван Петров", "email": "ivan@example.com" },
  "token": "1|abcdef..."
}

### Вход
POST /login
{
  "email": "ivan@example.com",
  "password": "secret123"
}
Ответ (200):
{
  "user": { "id": 1, "name": "Иван Петров", "email": "ivan@example.com" },
  "token": "1|abcdef..."
}

### Выход
POST /logout (требуется токен)
Ответ (200): { "message": "Logged out" }

## Авторы (публичные)

### Список авторов
GET /authors
Ответ (200):
[
  { "id": 1, "name": "Лев Толстой", "birth_year": 1828 },
  { "id": 2, "name": "Фёдор Достоевский", "birth_year": 1821 }
]

### Один автор
GET /authors/{id}
Ответ (200): { "id": 1, "name": "Лев Толстой", "birth_year": 1828 }

## Книги (требуется аутентификация)

### Список книг
GET /books
Ответ (200):
[
  {
    "id": 1,
    "title": "Война и мир",
    "author_id": 1,
    "published_year": 1869,
    "isbn": "978-5-17-123456-7"
  }
]

### Одна книга
GET /books/{id}
Ответ (200):
{
  "id": 1,
  "title": "Война и мир",
  "author_id": 1,
  "published_year": 1869,
  "isbn": "978-5-17-123456-7"
}

### Создать книгу
POST /books
{
  "title": "Преступление и наказание",
  "author_id": 2,
  "published_year": 1866,
  "isbn": "978-5-17-987654-3"
}
Ответ (201) – созданная книга

### Обновить книгу
PUT /books/{id} или PATCH /books/{id}
{
  "title": "Новое название",
  "published_year": 1867
}
Ответ (200) – обновлённая книга

### Удалить книгу
DELETE /books/{id}
Ответ (204) – без содержимого

## Дополнительные эндпоинты

### Информация о библиотеке (публичный)
GET /library
Ответ (200):
{
  "name": "Центральная городская библиотека",
  "address": "ул. Пушкина, 10",
  "total_books": 1250,
  "total_authors": 87
}

### Приветствие (публичный)
GET /hello
Ответ (200): { "message": "Hello, World!" }

### Текущий пользователь (требуется токен)
GET /user
Ответ (200):
{
  "id": 1,
  "name": "Иван Петров",
  "email": "ivan@example.com"
}

## Как использовать токен
Добавьте заголовок: Authorization: Bearer ваш_токен

Пример cURL:
curl -X GET http://127.0.0.1:8000/api/books -H "Authorization: Bearer 1|abcdef..."

## Установка проекта (для разработчиков)
git clone https://github.com/urpolka/laravel.git
cd library-api
composer install
cp .env.example .env
php artisan key:generate
# настройте базу в .env
php artisan migrate --seed
php artisan serve

Ключевые переменные .env:
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_DATABASE=library
DB_USERNAME=root
DB_PASSWORD=

## Типичные ошибки
- 401 Unauthorized – нет или неверный токен.
- 404 Not Found – неверный ID книги или автора.
- 422 Validation Error – не заполнены обязательные поля.

## Автоматическая генерация (Scribe)
composer require --dev knuckleswtf/scribe
php artisan scribe:generate
После этого откройте public/docs/index.html
## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
