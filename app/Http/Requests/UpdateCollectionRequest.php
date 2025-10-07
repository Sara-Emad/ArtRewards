<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;

class UpdateCollectionRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'min:2', 'max:50'],
            'description' => ['sometimes', 'required', 'string', 'max:200'],
            'cover_image_url' => ['sometimes', 'required', 'url'],
        ];
    }

    // failedValidation handled by ApiFormRequest
}


