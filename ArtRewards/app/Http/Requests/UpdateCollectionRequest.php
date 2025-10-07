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
            'cover_image' => ['sometimes', 'image', 'max:5120'],
            'cover_image_url' => ['sometimes', 'url'],
        ];
    }

    // failedValidation handled by ApiFormRequest
}


