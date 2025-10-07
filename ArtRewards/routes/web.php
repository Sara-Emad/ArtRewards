<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;

Route::get('/', function () {
    return view('welcome');
});

// L5-Swagger registers /api/documentation itself; no custom redirect to avoid loops
// Swagger UI fallback route: build required view data explicitly if package defaults fail
Route::get('/api/documentation', function () {
    $documentation = 'default';
    $config = config('l5-swagger.documentations.' . $documentation);
    $fileUsedForDocs = $config['paths']['docs_json'] ?? 'api-docs.json';
    if (!empty($config['paths']['format_to_use_for_docs']) && $config['paths']['format_to_use_for_docs'] === 'yaml' && !empty($config['paths']['docs_yaml'])) {
        $fileUsedForDocs = $config['paths']['docs_yaml'];
    }
    $useAbsolutePath = config('l5-swagger.documentations.' . $documentation . '.paths.use_absolute_path', false);
    $urlToDocs = route('l5-swagger.' . $documentation . '.docs', $fileUsedForDocs, $useAbsolutePath);
    $title = $config['api']['title'] ?? $documentation;
    $urlsToDocs = [ $title => $urlToDocs ];

    return view('l5-swagger::index', [
        'documentation' => $documentation,
        'documentationTitle' => $title,
        'secure' => request()->secure(),
        'urlToDocs' => $urlToDocs,
        'urlsToDocs' => $urlsToDocs,
        'operationsSorter' => config('l5-swagger.defaults.operations_sort'),
        'configUrl' => config('l5-swagger.defaults.additional_config_url'),
        'validatorUrl' => config('l5-swagger.defaults.validator_url'),
        'useAbsolutePath' => $useAbsolutePath,
    ]);
});