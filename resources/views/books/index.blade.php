<form method="GET" action="{{ route('books.index') }}">
    <select name="genre">
        <option value="">Все жанры</option>
        @foreach($genres as $genre)
            <option value="{{ $genre }}"
                @selected(request('genre') == $genre)>
                {{ $genre }}
            </option>
        @endforeach
    </select>
   <input type="text" name="search" value="{{ request('search') }}"
       placeholder="Поиск по названию">
@section('content')
    <h1>Список книг</h1>

    <table border="1" cellpadding="8">
        <tr>
            <th>Назва</th>
            <th>Автор</th>
            <th>Рік</th>
            <th>Дії</th>
        </tr>
        @foreach($books as $book)
        <tr>
            <td>{{ $book->title }}</td>
            <td>{{ $book->author->name ?? '—' }}</td>
            <td>{{ $book->year }}</td>
            {{ $books->links() }}
            <p>найдено: {{ $books->total() }}</p>
            <td>
                <a href="{{ route('books.edit', $book) }}">Ред.</a>
                <!-- Delete-форму додамо пізніше -->
            </td>
        </tr>
        @endforeach
    </table>

    <br>
    <a href="{{ route('books.create') }}">+ Добавить книгу</a>
@endsection