<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // 'sometimes' = проверяй только если поле передано
            // При update не все поля обязательны — можно обновить только title
            'title'          => 'sometimes|required|string|max:255',
            'author'         => 'sometimes|required|string|max:255',
            'isbn'           => 'nullable|string|max:20',
            'published_year' => 'nullable|integer|min:1000|max:2100',
            'description'    => 'nullable|string',
            'is_available'   => 'boolean',
        ];
    }
}
