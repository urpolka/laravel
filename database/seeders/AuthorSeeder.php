<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Author;

class AuthorSeeder extends Seeder
{
    public function run(): void
    {
        if (Author::count() === 0) {
            Author::factory()->count(5)->create();
        }
    }
}
