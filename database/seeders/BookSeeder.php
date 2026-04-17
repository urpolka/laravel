<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        if (Book::count() === 0) {
            Book::factory()->count(15)->create();
        }
    }
}