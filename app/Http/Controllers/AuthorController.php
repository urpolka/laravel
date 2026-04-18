<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\JsonResponse;

class AuthorController extends Controller
{
    public function index()
    {
         $authors = Author::withCount('books')->get();
          return view('authors.index', compact('authors'));
    }

    public function show(Author $author)
    {
        $author->load('books');
         return view('authors.show', compact('author'));
     }
}