import { Document } from 'mongoose';

interface QueryString {
    page?: number;
    limit?: number;
    sort?: string;
    fields?: any;
    category?: any;
}

export class APIFeatures<T extends Document> {
    queryString: QueryString;
    query: any;
    limit: number;
    currentPage: number;
    totalPages: number;
    paginatedList: any;


    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        if (queryObj.category) {
            const categories = queryObj.category.split(',');
            queryObj.category = { $in: categories };

        }
        // filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        this.limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * this.limit;

        this.query = this.query.skip(skip).limit(this.limit);
        this.currentPage = page;

        return this;
    }

    countPages() {
        const countQuery = this.query.model.countDocuments(this.query._conditions);
        return countQuery.then((count: number) => {
            this.totalPages = Math.ceil(count / this.limit);

        }).catch((err) => {
            console.error(`Error counting pages: ${err}`);
        });
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

}