<?php
namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse; // import типа ответа

class LibraryController extends Controller
{
   
    public function info(): JsonResponse
    {
        return response()->json([
            'name'        => 'Городская библиотека №1',
            'address'     => 'ул. Книжная, 42',
            'books_count' => 1240,
            'is_open'     => true,
        ]);
       
    }
}