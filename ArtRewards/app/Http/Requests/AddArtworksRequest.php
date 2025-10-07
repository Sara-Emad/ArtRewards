<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;

class AddArtworksRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'artwork_ids' => ['required', 'array', 'min:1'],
            'artwork_ids.*' => ['integer', 'exists:artworks,id'],
        ];
    }

    // failedValidation handled by ApiFormRequest
}


