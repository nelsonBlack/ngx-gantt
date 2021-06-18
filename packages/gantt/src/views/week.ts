import { GanttDatePoint } from '../class/date-point';
import { eachDayOfInterval, eachWeekOfInterval, GanttDate } from '../utils/date';
import { GanttView, GanttViewDate, GanttViewOptions, primaryDatePointTop, secondaryDatePointTop } from './view';

const viewOptions: GanttViewOptions = {
    start: new GanttDate().startOfQuarter().addQuarters(-1),
    end: new GanttDate().endOfQuarter().addQuarters(2),
    cellWidth: 280,
    addAmount: 1,
    addUnit: 'week'
};

export class GanttViewWeek extends GanttView {
    constructor(start: GanttViewDate, end: GanttViewDate, options?: GanttViewOptions) {
        super(start, end, Object.assign({}, viewOptions, options));
    }

    startOf(date: GanttDate) {
        return date.startOfWeek();
    }

    endOf(date: GanttDate) {
        return date.endOfWeek();
    }

    getPrimaryWidth() {
        return this.getCellWidth();
    }

    getDayOccupancyWidth(): number {
        return this.cellWidth;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
        const weeks = eachWeekOfInterval({ start: this.start.value, end: this.end.addSeconds(1).value }, { weekStartsOn: 1 });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < weeks.length; i++) {
            const weekStart = new GanttDate(weeks[i]);
            const increaseWeek = weekStart.getDaysInMonth() - weekStart.getDate() >= 3 ? 0 : 1;
            const point = new GanttDatePoint(
                weekStart,
                weekStart.addWeeks(increaseWeek).format('yyyy年MM月'),
                this.getCellWidth() / 2 + i * this.getCellWidth(),
                primaryDatePointTop
            );
            points.push(point);
        }
        return points;
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
        const days = eachDayOfInterval({ start: this.start.value, end: this.end.value });
        const weeks = eachWeekOfInterval({ start: this.start.value, end: this.end.value });
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < weeks.length; i++) {
            const start = new GanttDate(weeks[i]);
            const point = new GanttDatePoint(
                start,
                `第${start.getWeek()}周`,
                i * this.getCellWidth() + this.getCellWidth() / 2,
                secondaryDatePointTop
            );
            points.push(point);
        }
        return points;
    }
}