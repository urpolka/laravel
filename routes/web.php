<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthorController;

Route::resource('books', BookController::class);
Route::resource('authors', AuthorController::class);
Route::get('/', function () {
    return view('welcome');
});