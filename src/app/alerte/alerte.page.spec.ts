import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { AlertePage } from './alerte.page';

describe('AlertePage', () => {
  let component: AlertePage;
  let fixture: ComponentFixture<AlertePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertePage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
