import {
  Directive,
  ElementRef,
  Host,
  HostBinding,
  HostListener,
  Injectable,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { noop, of, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { filter } from 'rxjs/internal/operators/filter';
import { shareReplay } from 'rxjs/internal/operators/shareReplay';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
export interface ScrollPosition {
  x: number;
  y: number;
}

@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  private _element: Element;

  private readonly _events = new BehaviorSubject<ScrollPosition>({
    x: 0,
    y: 0,
  });
  readonly state$ = this._events.asObservable().pipe(
    filter((e) => !!e),
    switchMap((e) => of(this._element.getBoundingClientRect())),
    distinctUntilChanged((a, b) => a.x === b.x && a.y === b.y),
    shareReplay(1)
  );

  onScroll(event: ScrollPosition) {
    // 0.01ms on average
    this._events.next(event);
  }

  setElement(element: Element) {
    this._element = element;
  }
}

@Directive({
  selector: '[appScroll]',
})
export class ScrollDirective {
  // window listening because Y scrolling has height 100% on table
  @HostListener('document:scroll') scroll = () => {
    // eslint-disable-next-line no-console
    this.scrollStateSvc.onScroll({
      x: window.scrollX,
      y: window.scrollY,
    } as ScrollPosition);
  };

  constructor(
    @Host() host: ElementRef,
    private readonly scrollStateSvc: ScrollStateService
  ) {
    this.scrollStateSvc.setElement(host.nativeElement as Element);
  }
}

@Directive({
  selector: '[appStickyHeader]',
})
export class StickyHeader implements OnInit, OnDestroy {
  // Relevant style properties for sticky headers
  @HostBinding('style.transform') transform: string;

  // optimization props
  @HostBinding('style.will-change') willChange: 'auto' | 'transform' = 'auto'; // on-off to anticipate changes as we scroll

  private readonly ngUnsubscribe = new Subject();
  constructor(private readonly scrollStateSvc: ScrollStateService) {}

  ngOnInit(): void {
    this.scrollStateSvc.state$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(({ y, height }) => this.updatePosition(y, height));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updatePosition(y: number, height: number) {
    // If element vertical position is positive it's below
    // Move to top of element
    if (y > 0) {
      this.willChange = 'auto';
      this.transform = `translate3d(0px, 0px, 0px)`;
      return;
    }

    // Handle if we scroll past element
    if (-y > height) {
      this.willChange = 'auto';
      this.transform = `translate3d(0px, ${height}px, 0px)`;
      return;
    }

    // Translate headers if currently scrolling element
    this.willChange = 'transform';
    this.transform = `translate3d(0px, ${-y}px, 0px)`;
  }
}
