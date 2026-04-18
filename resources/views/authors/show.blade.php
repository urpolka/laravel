@extends('layouts.app')
@section('title', $author->name)

@section('content')
    <h1>{{ $author->name }}</h1>

    <h3>Книги этого автора:</h3>
    @forelse($author->books as $book)
        <p>{{ $book->title }} ({{ $book->year }})</p>
    @empty
        <p>У автора нет книг.</p>
    @endforelse

    <a href="{{ route('authors.index') }}">← Все авторы</a>
@endsection