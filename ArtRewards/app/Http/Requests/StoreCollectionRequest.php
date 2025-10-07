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
            'cover_image' => ['sometimes', 'required_without:cover_image_url', 'image', 'max:5120'],
            'cover_image_url' => ['sometimes', 'required_without:cover_image', 'url'],
        ];
    }

    // failedValidation handled by ApiFormRequest
}


