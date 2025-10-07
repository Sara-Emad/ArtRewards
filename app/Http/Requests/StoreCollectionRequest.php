<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;

class StoreCollectionRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'artist_id' => ['required', 'exists:artists,id'],
            'title' => ['required', 'string', 'min:2', 'max:50'],
            'description' => ['required', 'string', 'max:200'],
            'cover_image_url' => ['required', 'url'],
        ];
    }

    // failedValidation handled by ApiFormRequest
}


