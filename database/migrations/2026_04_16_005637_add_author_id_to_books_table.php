<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
        // nullable() — чтобы существующие записи не сломались
        // ->after('id') — визуально удобно, не обязательно
        $table->foreignId('author_id')
               ->nullable()
               ->constrained()      // создаёт FK constraint → таблица authors
               ->nullOnDelete()     // если автор удалён → author_id = null
               ->after('id');
        });
    }
    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
        $table->dropForeign(['author_id']);
        $table->dropColumn('author_id');
        });
    }
};