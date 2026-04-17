<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'author_id', // ← добавь author_id!
        'isbn', 'published_year', 'description', 'is_available',
    ];

    /**
     * Книга принадлежит ОДНОМУ автору.
     * belongsTo определяется в модели с внешним ключом (Book).
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
        // Eloquent ищет author_id в таблице books → id в таблице authors
    }
};