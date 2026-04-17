<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\JsonResponse;

class AuthorController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Author::with('books')->get());
    }

    public function show(Author $author): JsonResponse
    {
        $author->load('books');
        return response()->json($author);
    }
}