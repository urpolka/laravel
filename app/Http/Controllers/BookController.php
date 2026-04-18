<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with('author');
         if ($request->filled('genre')) {
        $query->where('genre', $request->genre);
         }
         if ($request->filled('search')) {
        $query->where('title', 'like', '%' . $request->search . '%');
         }
          $query->orderBy('year', 'desc');
           $books = $query->paginate(5)->withQueryString();
            $genres = Book::distinct()->pluck('genre');

            return view('books.index', compact('books', 'genres'));
    }

    public function store(StoreBookRequest $request): JsonResponse
    {
        $book = Book::create($request->validated());
        return response()->json($book, 201);
    }

    public function show(Book $book): JsonResponse
    {
    $book->load('author');
    return response()->json($book);
    }
    public function update(UpdateBookRequest $request, Book $book): JsonResponse
    {
        $book->update($request->validated());
        return response()->json($book->fresh());
    }

   public function destroy(Book $book): \Illuminate\Http\Response
   {
    $book->delete();
    return response()->noContent();
   }
}