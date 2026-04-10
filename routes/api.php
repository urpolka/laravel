<?php
use App\Http\Controllers\LibraryController;
use Illuminate\Support\Facades\Route;
Route::get('/library', [LibraryController::class, 'info']); 