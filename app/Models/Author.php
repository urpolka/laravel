<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Author extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'bio', 'born_year'];

    /**
     * Один автор имеет МНОГО книг.
     * hasMany определяется в РОДИТЕЛЬСКОЙ модели (Author).
     */
    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
        // Eloquent сам знает что искать по author_id в таблице books
    }
};
