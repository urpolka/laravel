<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\BookController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthorController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::get('/books',      [BookController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {

    // Логаут
    Route::post('/logout', [AuthController::class, 'logout']);

    // Текущий пользователь
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
        });

    // Запись книг — только авторизованным
    Route::post('/books',              [BookController::class, 'store']);
    Route::put('/books/{book}',        [BookController::class, 'update']);
    Route::patch('/books/{book}',      [BookController::class, 'update']);
    Route::delete('/books/{book}',    [BookController::class, 'destroy']);
    });
Route::apiResource('authors', AuthorController::class)->only(['index', 'show']);
Route::get('/library', [LibraryController::class, 'info']);
Route::get('/hello', fn() => response()->json(['message' => 'Hello World']));
Route::get('/x', fn() => response()->json(['message' => 'ХУЙ']));
