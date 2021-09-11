import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { SynopsisDialogComponent } from '../synopsis-dialog/synopsis-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  faved: Boolean = false;
  favs: string[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavs();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.movies = resp;
        console.log(this.movies);
        return this.movies;
      });
    }

    openGenreDialog(genreName: string, genreDescription: string): void {
      this.dialog.open(GenreDialogComponent, {
        width: '400px',
        data: {genreName, genreDescription}
      })
    }

    openDirectorDialog(directorName: string, directorBio: string, directorBirth: string): void {
      const directorBirthday = new Date(directorBirth).toISOString().split('T')[0];
      this.dialog.open(DirectorDialogComponent, {
        width: '400px',
        data: {directorName, directorBio, directorBirthday}
      })
    }

    openSynopsisDialog(movieDescription: string): void {
      this.dialog.open(SynopsisDialogComponent, {
        width: '400px',
        data: {movieDescription}
      })
    }

  getFavs(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
       this.favs = resp.FavoriteMovies
       return this.favs
    })
  }

  isFav(id: string): Boolean {
    return this.favs.includes(id) ? this.faved = true : this.faved = false
  }

  toggleFav(id: string): void {
    console.log(id);
    if (this.faved) {
      this.fetchApiData.removeFavorite(id).subscribe((resp: any) => {
        console.log(resp);
        this.getFavs()
      })
    } else {
      this.fetchApiData.addFavorite(id).subscribe((resp: any) => {
        console.log(resp);
        this.getFavs()
      })
    }
  }
}
