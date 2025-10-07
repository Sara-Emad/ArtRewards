<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $asJson = function ($request): bool {
            return $request->is('api/*') || $request->expectsJson();
        };

        $exceptions->render(function (ValidationException $e, $request) use ($asJson) {
            if ($asJson($request)) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        $exceptions->render(function (ModelNotFoundException $e, $request) use ($asJson) {
            if ($asJson($request)) {
                return response()->json([
                    'message' => 'Resource not found',
                ], 404);
            }
        });

        $exceptions->render(function (NotFoundHttpException $e, $request) use ($asJson) {
            if ($asJson($request)) {
                return response()->json([
                    'message' => 'Endpoint not found',
                ], 404);
            }
        });

        $exceptions->render(function (MethodNotAllowedHttpException $e, $request) use ($asJson) {
            if ($asJson($request)) {
                return response()->json([
                    'message' => 'Method not allowed',
                ], 405);
            }
        });

        $exceptions->render(function (\Throwable $e, $request) use ($asJson) {
            if ($asJson($request)) {
                $status = $e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500;
                return response()->json([
                    'message' => $status === 500 ? 'Server error' : ($e->getMessage() ?: 'Error'),
                ], $status);
            }
        });
    })->create();
