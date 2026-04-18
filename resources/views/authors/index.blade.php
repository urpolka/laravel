@extends('layouts.app')
@section('title', 'Автори')

@section('content')
    <h1>Автори</h1>
    <ul>
    @foreach($authors as $author)
        <li>
            <a href="{{ route('authors.show', $author) }}">
                {{ $author->name }}
            </a>
            — {{ $author->books_count }} кн.
        </li>
    @endforeach
    </ul>
@endsection