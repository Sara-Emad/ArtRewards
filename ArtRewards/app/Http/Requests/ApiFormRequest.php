<?php

namespace App\Http\Requests;

use App\Support\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * Base FormRequest that forces JSON API-style validation errors.
 */
abstract class ApiFormRequest extends FormRequest
{
    protected function failedValidation(Validator $validator): void
    {
        $response = ApiResponse::error('Validation failed', 422, $validator->errors()->toArray());
        throw new HttpResponseException($response);
    }
}


