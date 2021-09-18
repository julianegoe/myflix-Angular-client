import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from './types/User'
const apiUrl = 'https://myflix-0001.herokuapp.com/';


@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService  {

  constructor(private http: HttpClient) { }

  /**
   * Creating a new user record
   * @param userDetails   
   * @returns success: User data error: error message
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError)
    );
  };

  /**
   * Logging in
   * @param userUsername   
   * @param userPassword
   * @returns success: User data error: error message
   */
  public userLogin(userUsername: string, userPassword: string): Observable<any> {
    return this.http.post(`${apiUrl}login?Username=${userUsername}&Password=${userPassword}`, {}).pipe(
    catchError(this.handleError)
    );
  };

  /**
   * Requesting all movies in database
   * @returns success: Movie data error: error message
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}movies`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      catchError(this.handleError)
    );
  };

  /**
   * Requesting data of one director
   * @param directorName
   * @returns success: director data error: error message
   */
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}directors/${directorName}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      catchError(this.handleError)
      )
  };

  /**
   * Requesting data of one genre
   * @param genreName
   * @returns success: genre data error: error message
   */
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}directors/${genreName}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      catchError(this.handleError)
    );
  };

   /**
   * Requesting user data of logged in user
   * @returns success: user data error: error message
   */
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
      .get(apiUrl + `users/${user}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  };

   /**
   * adding movie to list of favorites
   * @param id movie id
   * @returns success: user data with updated FavoriteMovies entry error: error message
   */
  addFavorite(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.put(`${apiUrl}users/${user}/movies/${id}`, null, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      catchError(this.handleError)
    );
  };

  /**
   * removing movie to list of favorites
   * @param id movie id
   * @returns success: user data with updated FavoriteMovies entry error: error message
   */
  removeFavorite(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.delete(`${apiUrl}users/${user}/movies/${id}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      catchError(this.handleError)
    );
  };

  /**
   * updating user info
   * @param userDetails object with data to update
   * @returns success: user data error: error message
   */
  EditUserInfo(userDetails: User): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.put(`${apiUrl}users/${user}`, userDetails, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      catchError(this.handleError)
    );
  };

  /**
   * deleting logged in user from database
   * @returns success: success message, error: error message
   */
  deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.delete(`${apiUrl}users/${user}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );
  }

/**
   * logs readable error messages
   * @returns error message in console
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:');
    console.error(error.error);
    } else {
    console.log(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error.error}`);
    }
    return throwError(
    'Something bad happened; please try again later.');
  }
}
