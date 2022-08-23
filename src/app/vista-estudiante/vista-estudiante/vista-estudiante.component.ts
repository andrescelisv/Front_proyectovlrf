import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-vista-estudiante',
  templateUrl: './vista-estudiante.component.html',
  styleUrls: ['./vista-estudiante.component.scss']
})
export class VistaEstudianteComponent implements OnInit {
  headerBGUrl!: string;
  @ViewChild('stickHeader') header!: ElementRef;
  subs: Subscription[] = [];
  trending!: any;
  sticky = false;
  popular!: any;
  topRated!: any;
  originals!: any;
  nowPlaying!: any;
  sliderConfig = {
    slidesToShow: 7,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true
  };
  constructor(private _adminService: AdminService) { }

  ngOnInit(): void {
    this.subs.push(this._adminService.getTrending().subscribe(data => {
      this.trending = data;
      this.headerBGUrl = 'https://image.tmdb.org/t/p/original' + this.trending.results[0].backdrop_path;
    }));
    this.subs.push(this._adminService.getPopularMovies().subscribe(data => this.popular = data));
    this.subs.push(this._adminService.getTopRated().subscribe(data => this.topRated = data));
    this.subs.push(this._adminService.getOriginals().subscribe(data => this.originals = data));
    this.subs.push(this._adminService.getNowPlaying().subscribe(data => this.nowPlaying = data));

  }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

  @HostListener('window:scroll', ['$event'])
  // tslint:disable-next-line:typedef
  handleScroll() {
    const windowScroll = window.pageYOffset;

    if (windowScroll >= this.header.nativeElement.offsetHeight) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }
}
