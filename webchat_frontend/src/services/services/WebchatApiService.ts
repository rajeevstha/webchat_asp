/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserRequest } from '../models/CreateUserRequest';
import type { LoginRequest } from '../models/LoginRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WebchatApiService {

    /**
     * @param requestBody 
     * @returns any OK
     * @throws ApiError
     */
    public static postApiAuthRegister(
requestBody: CreateUserRequest,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns any OK
     * @throws ApiError
     */
    public static postApiAuthLogin(
requestBody: LoginRequest,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postApiAuthLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/logout',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postApiAuthRefresh(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/refresh',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAuthMe(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/me',
        });
    }

    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiUsers(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users',
        });
    }

    /**
     * @param id 
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiUsers(
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param userId 
     * @returns any OK
     * @throws ApiError
     */
    public static getApiMessages(
userId: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/messages/{userId}',
            path: {
                'userId': userId,
            },
        });
    }

}
