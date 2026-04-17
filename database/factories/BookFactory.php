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
        'title' => fake()->sentence(3),
        'isbn' => fake()->isbn13(),
        'published_year' => fake()->numberBetween(1950, 2023),
        'description' => fake()->paragraph(),
        'is_available' => fake()->boolean(),
        'author_id' => Author::factory(),
        ];
    }
}