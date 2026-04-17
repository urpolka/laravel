<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Author;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Определяем как выглядит одна книга с фейковыми данными.
     * $this->faker — экземпляр FakerPHP
     */
    public function definition(): array
    {
        return [
        'title' => $this->faker->sentence(3),
        'isbn' => $this->faker->isbn13(),
        'published_year' => $this->faker->numberBetween(1950, 2023),
        'description' => $this->faker->paragraph(),
        'is_available' => $this->faker->boolean(),
        'author_id' => Author::factory(),
        ];
    }
}