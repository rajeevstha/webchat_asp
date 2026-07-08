/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserRequestAdmin } from '../models/CreateUserRequestAdmin';
import type { UpdateUserRequest } from '../models/UpdateUserRequest';
import type { UserDto } from '../models/UserDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdminService {

    /**
     * @returns UserDto OK
     * @throws ApiError
     */
    public static getApiAdminUsers(): CancelablePromise<Array<UserDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/users',
        });
    }

    /**
     * @param requestBody 
     * @returns UserDto OK
     * @throws ApiError
     */
    public static postApiAdminUsers(
requestBody?: CreateUserRequestAdmin,
): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id 
     * @returns UserDto OK
     * @throws ApiError
     */
    public static getApiAdminUsers1(
id: string,
): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/users/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @param requestBody 
     * @returns UserDto OK
     * @throws ApiError
     */
    public static putApiAdminUsers(
id: string,
requestBody?: UpdateUserRequest,
): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id 
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiAdminUsers(
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/users/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @returns any OK
     * @throws ApiError
     */
    public static putApiAdminUsersBlock(
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/users/{id}/block',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @returns any OK
     * @throws ApiError
     */
    public static putApiAdminUsersUnblock(
id: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/users/{id}/unblock',
            path: {
                'id': id,
            },
        });
    }

}
